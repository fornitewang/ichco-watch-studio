"""Build a source-traceable catalog from the verified public ICH snapshots.
Run after fetching snapshots and local thumbnails; see docs/CATALOG_REVIEW.md.
"""
from pathlib import Path
import json,re,html,hashlib
from bs4 import BeautifulSoup
from collections import Counter
import argparse
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('snapshot_dir',type=Path)
args=parser.parse_args()
base=args.snapshot_dir
repo=Path(__file__).resolve().parents[1]
def read(path):return json.loads((base/path).read_text(encoding='utf-8'))
inventory=read('inventory/inventory.json')
custom=read('variants/products.json')['products']
raw=read('inventory/noncustom-products-full.json')+custom
byid={p['id']:p for p in raw}
verified={p['id']:p for p in read('variants/custom-products-normalized.json')['products']}
overrides=read('variants/variant-image-overrides.json')
supplements=read('inventory/specs-supplement.json')
excluded={69109906:'accessory',70332384:'accessory',71186538:'accessory',71186639:'accessory',77575450:'custom_request'}
previews={'ichco-nh35-series-customize':'SUB','ichco-customize-seikomod-marinamilitare':'MM','ichco-polar-prospector-customized-watch-':'PRO','ichco-daytona-series':'DAY','ichco-customize-seikomod-royal-chronograph':'ROY','ich-co-santos':'SAN'}
def option_label(option):
 name=option['name'].strip();key=name.lower()
 if key in ['color','colors','tips color']:return '款式／配色'
 if key=='type':return '款式'
 if key=='set':return '套組'
 if key=='watch strap':return '錶帶'
 if key=='material':return '錶帶' if all('帶' in v for v in option['values']) else '機芯'
 return name
def local(image,thumb=False):
 key=str(image['id']);path='assets/catalog/images/'+key+('-t' if thumb else '')+'.webp'
 return path if (repo/path).exists() else image.get('src') or image['img_url']
def description(p):
 soup=BeautifulSoup(p.get('description') or p.get('content') or '', 'html.parser')
 for n in soup(['script','style','link','iframe','form']):n.decompose()
 lines=[]
 for text in soup.get_text('\n',strip=True).splitlines():
  text=re.sub(r'\s+',' ',text).strip()
  if text and text not in lines and not re.search(r'點此加入客服|<<<<',text):lines.append(text)
 # Preserve text nodes within bold/strong labels as one specification line.
 paras=[]
 for tag in soup.find_all(['p','li','tr']):
  t=''.join(tag.stripped_strings).strip()
  if t:paras.append(t)
 specs=[];seen=set()
 for line in paras+lines:
  m=re.match(r'^\s*([^:：]{1,16})\s*[:：]\s*(.+)$',line)
  if m and re.search(r'機[芯心]|錶徑|表徑|尺寸|厚度|重量|鏡|防水|錶殼|錶帶|把[冠把]|背[蓋盖]|功能|動能|動力|材質|規格|保固',m[1]) and m[1] not in seen:
   specs.append({'label':m[1].strip(),'value':m[2].strip()});seen.add(m[1])
 return lines,specs[:18]
products=[]
for entry in inventory:
 p=byid[entry['id']];vproof=verified.get(p['id']);lines,specs=description(p)
 supplement=supplements.get(str(p['id']),{})
 if supplement.get('specs'):specs=[{'label':k,'value':v} for k,v in supplement['specs']]
 if vproof and vproof.get('verified_image_specs'):
  specs=[{'label':k,'value':v} for k,v in vproof['verified_image_specs']['specs']]
 ims={int(i['id']):i for i in p['images'] if i.get('src') or i.get('img_url')}
 for v in p['variants']:
  if v.get('featured_image'):ims[int(v['featured_image']['id'])]=v['featured_image']
 variants=[];omitted=[]
 for v in p['variants']:
  if v['id'] in excluded:
   omitted.append({'id':v['id'],'title':v['title'],'kind':excluded[v['id']],'price':v['price']/100});continue
  override=overrides.get(str(v['id']));im=ims[override['image_id']] if override else v.get('featured_image')
  assert im,(p['id'],v['id'],'missing image')
  variants.append({'id':v['id'],'title':'標準款' if v['title'].strip().lower()=='default title' else v['title'].strip(),'sku':v.get('sku') or '', 'options':[str(o).strip() for o in v.get('options',[])], 'price':v['price']/100, 'compareAtPrice':(v.get('compare_at_price') or 0)/100, 'available':bool(v.get('available')),'imageId':int(im['id']),'imageSource':override['source'] if override else 'official_variant','sourceImage':im['src'],'requiresClarification':v['id'] in [53420747,52853117]})
 title=p['title'].strip()
 display=re.sub(r'^(?:瑞士|美國|日本|英國|德國)\s*','',title)
 display=re.sub(r'^(?:ICH\s*\.?\s*CO|ICHCO|ICHco)\s*[-–]?\s*','',display,flags=re.I)
 display=re.sub(r'\s*(?:customized watch|customize watch|customize|customized)\s*',' ',display,flags=re.I)
 display=re.sub(r'\s*(?:客製化錶款系列|客製化錶款|客製化自動機械錶|客製化皇家計時系列|客製錶)\s*[-–]?\s*seikomod','',display,flags=re.I)
 display=re.sub(r'\s+',' ',display).strip(' -–')
 kind='custom' if p['id'] in verified else 'brand'
 note='選擇官網提供的型號與搭配。'+('其他錶面、指針、錶帶等客製需求，請向 ICH 客服確認可製作範圍與報價。' if kind=='custom' else '此款依原廠與官網提供的規格販售。')
 if any(x['kind']=='custom_request' for x in omitted):note+=' 官網另有「客製化選項」洽詢服務，具體搭配與售價需另行確認。'
 photoCounts=Counter(v['imageId'] for v in variants)
 for v in variants:v['sharedImage']=photoCounts[v['imageId']]>1
 products.append({'id':p['id'],'slug':p['handle'],'title':title,'displayName':display,'brand':entry['brand'],'kind':kind,'officialUrl':p['share_url'],'cover':local(p['featured_image'],True),'coverSource':p['featured_image']['src'],'options':[{'name':option_label(o),'sourceName':o['name'],'values':[str(x).strip() for x in o['values']]} for o in p['options_with_values']],'variants':variants,'images':[{'id':key,'src':local(im),'thumb':local(im,True),'source':im.get('src') or im['img_url'],'alt':im.get('alt') or ''} for key,im in ims.items()],'specs':specs,'descriptionLines':lines,'descriptionImages':supplement.get('descriptionImages',[]),'specImageSource':(vproof.get('verified_image_specs') or {}).get('source') if vproof else None,'customizeNote':note,'accessoryCount':sum(x['kind']=='accessory' for x in omitted),'excludedOptions':omitted,'previewSeries':previews.get(p['handle']),'previewVariantIds':[67164557] if p['handle']=='ichco-customize-seikomod-marinamilitare' else []})
assert len(products)==163
assert sum(len(p['variants']) for p in products)==1194
assert len({p['slug'] for p in products})==163
assert len({v['id'] for p in products for v in p['variants']})==1194
for p in products:
 assert all(v['price']>0 and v['imageId'] in {im['id'] for im in p['images']} for v in p['variants'])
 assert len({tuple(v['options']) for v in p['variants']})==len(p['variants']),(p['slug'],'duplicate choices')
data={'schemaVersion':1,'checkedDate':'2026-09-07','currency':'TWD','source':'https://www.ichco.com.tw','scope':'Official public watch products, including all brands; standalone accessories excluded.','productCount':len(products),'variantCount':sum(len(p['variants']) for p in products),'products':products}
(repo/'assets/catalog-data.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps({'products':len(products),'variants':data['variantCount'],'brands':len({p['brand'] for p in products}),'custom':sum(p['kind']=='custom' for p in products),'localCovers':sum(p['cover'].startswith('assets/') for p in products),'specsMissing':sum(not p['specs'] for p in products),'KB':round((repo/'assets/catalog-data.json').stat().st_size/1024)}))

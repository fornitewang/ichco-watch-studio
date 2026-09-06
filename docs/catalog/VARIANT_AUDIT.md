# ICH official variant and pricing audit

Retrieved on 2026-09-07. Scope: all 163 complete-watch product pages identified by inventory, plus per-variant accessories retained separately.

- 1,199 unique variants in 163 product groups. Raw public product and collection JSON are preserved outside the site repository.
- **Currency units differ:** product.price, product.price_min and product.price_max use NT dollars; variant.price and variant.compare_at_price use hundredths of an NT dollar. Divide only variant prices by 100. Every one of the 163 product ranges agrees with its raw variant prices after scaling.
- A selected official variant is an existing complete configuration, not a cartesian product of any visible options. If options are presented independently, restrict later choices to actual tuples in variants; display that tuple's full price directly.
- `available` is the storefront's availability flag, not a promise of stock count or delivery date. `inventory_quantity=null`, `infinite_stock=true` are common and must not be turned into a numerical stock count.
- Five single-variant products have no options_with_values but have the internal string Default Title. Hide this internal label, use 標準款 or its nonempty SKU. Their IDs are in data-audit.json.
- Render compare-at prices only if positive and greater than the actual selling price. Zero compare-at values exist.
- Preserve official typos in model IDs (e.g. Datejust SSI-Predential, Daytona D-ST-SWHB)); cleaning the model ID can break traceability.

## Watch versus accessory versus quotation

Confirmed stand-alone accessory variants embedded within a watch product:

| Variant ID | Parent | Official variant | Actual accessory price |
|---|---|---|---:|
| 69109906 | MarinaMilitare | Buckle | NT$450 |
| 70332384 | Carbon Tattoo | 選配真碳纖圈 | NT$1,480 |

Exclude these from the parent complete-watch minimum/maximum prices. They may remain in a separately labeled accessory area. Adding the carbon bezel to a watch is not an officially published complete variant, so do not invent fitment or installation price.

Datejust 77575450 (客製化選項, listed NT$7,280) is a customization enquiry option. Its image is a bare movement, not a completed configuration. Keep the listed amount if useful, but say actual configuration and quotation require ICH confirmation; do not present this as a uniquely specified completed watch.

Do not filter accessories merely by 錶帶/加購 in variant titles. Parnis Submariner and DIDUN Nautilus variants include complete watches with optional extra straps; Parnis MarinaMilitare/Radiomir also use strap names for complete-watch variants. Their variant prices are full totals, not surcharges.

## Custom products

13 ICH custom product groups including Samurai, which does not appear in the older 12-item customize collection. 99 variants total: 96 completed configurations, 2 accessory variants, 1 customization enquiry. Full JSON lives in products.json; normalized data and visually checked graphic specifications live in custom-products-normalized.json.

- Yacht-Club: two NT$7,580 variants; manual winding, 55-hour reserve and 50 m from official specification graphic.
- Daytona new product: four NT$5,880 configurations; VK63, 40 mm, 100 m.
- Datejust: eight configured watches at NT$7,280 plus one enquiry option; NH35, 40 mm, 100 m. Gallery does not mean every bracelet can be combined with every dial at that price.
- Speedmaster: six NT$5,880 variants; VK64 two-subdial chronograph, 40 mm, 100 m. Do not copy the Daytona VK63 dial.
- Carbon Tattoo: five watches at NT$7,580 / 8,680 / 7,580 / 7,880 / 7,680, plus NT$1,480 bezel accessory; use the specific variant's NH35, NH34-GMT or NH70 name.
- Polar-Prospector: three NT$8,980 variants, NH35, 43 mm, 200 m.
- MM: five complete watches, 40 mm NH35 NT$6,880 or 42 mm labeled NH38 NT$7,580. The generic page text mixes functions across variants; do not claim every variant has a date and an open heart.
- Royal Chronograph: 17 variants NT$5,880 and RC-SWHBU-Plus NT$6,380. Official text calls the movement NVK63 and mentions 42 mm / 100 m.
- NH35 Series: eleven complete variants NT$7,280 or NT$8,580. Despite the page's old NH35-only body text, the actual variant catalog also includes NH34.
- Royal Skeleton: three NT$7,680 variants; NH70, 42 mm, sapphire, butterfly clasp.
- Daytona Series older product: 26 NT$5,880 variants, separate product ID from the four-variant new Daytona page; preserve both product groups.
- Santos: two NT$5,880 configurations, Miyota 8215 or Seiko NH35. 38 mm, 12 mm thick, 30 m; closed back for 8215 and exhibition back for NH35.
- Samurai: three NT$7,880 variants; I2801-A automatic, case 42 x 55 mm, 15 mm thick, sapphire, 50 m, silicone strap.

## Images

variant-image-overrides.json resolves all 38 missing variant-image links:
- 20 Fossil Bannon variants by exact model token in official gallery alt.
- 11 Hugo Boss Admiral variants by exact model number in official gallery alt (HB prefix omitted in image alt).
- Four AILANG BR-SKE and three Pagani PD1659 colors by visual inspection of their own official gallery.

Two additional overrides correct weak original bindings: AILANG GREEN originally pointed to a black strap/dial image; Pagani black originally pointed to a mixed composite with black and steel cases. All 40 replacements come from the same product's official gallery. Source and evidence are recorded per variant. Image-audit contact sheets preserve visual review.

Shared images across options are permitted by the official data, and may show only the core watch while the selected option includes an extra strap. Do not claim that every gallery image displays every selected accessory. Do not invent a rendered image for a combination absent from the data.

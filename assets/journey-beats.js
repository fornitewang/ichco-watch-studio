/* Auto-play seconds. The end values address the original scroll choreography, not seconds. */
(() => {
  const opening=t=>t/0.42*1.8;
  const unfolding=t=>t/3.53*38.2;
  // 調速時只改 seconds；end 維持原本的零件／流星／機芯出場順序。
  window.ICHJourneyBeats=[
    {id:'01',name:'香水按壓與噴霧',kind:'perfume',seconds:.94},
    {id:'02',name:'開場文字退去',kind:'scene',end:.281,seconds:opening(.281)},
    {id:'03',name:'完整手錶停留',kind:'scene',end:.42,seconds:opening(.139)},
    {id:'04',name:'外層手錶展開',kind:'scene',end:.95,seconds:unfolding(.53)},
    {id:'05',name:'外層零件解說',kind:'scene',end:1.30,seconds:unfolding(.35)},
    {id:'06',name:'流星穿越',kind:'scene',end:2.161,seconds:5.6},
    {id:'07',name:'撞擊與碎片',kind:'scene',end:2.32,seconds:unfolding(.159)},
    {id:'08',name:'機芯浮現',kind:'scene',end:2.62,seconds:1.9},
    {id:'09',name:'完整機芯停留',kind:'scene',end:2.94,seconds:.9},
    {id:'10',name:'機芯展開',kind:'scene',end:3.50,seconds:4.2},
    {id:'11',name:'機芯零件解說',kind:'scene',end:3.95,seconds:unfolding(.45)},
    {id:'12',name:'走近錶帶轉盤',kind:'travel',target:'#strap-study',seconds:2.4},
    {id:'13',name:'錶帶轉盤欣賞',kind:'hold',seconds:3},
    {id:'14',name:'抵達塔羅選牌',kind:'travel',target:'#path-cards',seconds:2.8}
  ];
})();

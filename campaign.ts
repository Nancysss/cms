// 通过草稿获取 campion_id   广告10

// const campaignName = "znx test campaign.ts fetch create campaign";

fetch(
  "https://ads.tiktok.com/api/v4/i18n/creation/campaign_snap/save/?aadvid=7417667470661697537&req_src=ad_creation&msToken=-0G2nGU3WMsZDThv3VW5E7iEA-wwlbPQl4y7vs6jmLPlpWE00mp91nRICbMjVajhdRbq0_yyoggarvnyjw1c3kSW-8Pqrl9Xsk1S5cDMvKyPoFSRBAEDnJ37AwpqDz0aiSQbNw==&X-Bogus=DFSzswVub9X4kbFOt6cjXz9WcBnv&_signature=_02B4Z6wo00001nPstKQAAIDCc-y0pIj2fwpz7LAAAPoQ18",
  {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh,zh-CN;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/json; charset=UTF-8",
      pragma: "no-cache",
      priority: "u=1, i",
      request_start_time: "1727689785176",
      "sec-ch-ua":
        '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrftoken": "2s0hHtqOmT4VtDqKXn8B3MU29GLiogmd",
      "x-ttam-uuid": "ffda5d8b-cde1-4df8-9d98-7be444255a23",
      "x-ttam-version": "1.0.3.8563",
      cookie:
        "_ga=GA1.1.1244467843.1712245261; _tt_enable_cookie=1; uid_tt=4831f77dbfc93831ac30081e79c673c71a44de0bae707164da56fc2212ec985b; uid_tt_ss=4831f77dbfc93831ac30081e79c673c71a44de0bae707164da56fc2212ec985b; sid_tt=90e19a2c05ebcaedb465c53e5ab73cee; sessionid=90e19a2c05ebcaedb465c53e5ab73cee; sessionid_ss=90e19a2c05ebcaedb465c53e5ab73cee; store-idc=useast5; store-country-code=us; store-country-code-src=uid; tt-target-idc-sign=CG32kfT9M00HjeRJCqXkzc1ohqOVzJ9QXDJnjjtxA6tBJdKT4GcA-_bKQ3tIuDCFPTWQbphOfwoWXGAoalSd-NXxIO62J2EK9oD5jA7HX_HuWxZlclRu_XFdypzET1ArHYlZHnG5D4HzOmq8LcZYzCTyNyIa49M9mjL9NpQLWKxBypAldnzTzRTBz9tCfRyzx_UB6EuCCijPgi24VjGGqPZ1zXa43kIPgTs7CPMSBo53dTwEUMIZxW1783jCM5WACHEPCVIW7DtFsGJY04Px7DoxoDFRwL6vx7XR1n-VpHDHiUPSmDIGfuC6HuqylmZTJlFAjMH5wo4PuCmbYkNanh53IeZiulSS3PfIUePW22W7rXUJ-PXbB1ChxxJTRcPx9p1mbWaVo8EwMHU0zK8u5inbWm37qemGhnxJaXpTS91XflAHqdZu4zLN0TC_EKFKj-JMZQWDLbCtabz6tAwrk9BS7grkvG8msJU1Y90yYk-Uh1eu4hwljzqILC7oc_fS; _ttp=2fHKsElRAwqCyPYg7IAiWrJjlnT; i18next=en; tt-target-idc=useast8; _ga_W44EJN0C49=GS1.1.1721721852.4.0.1721721852.0.0.0; passport_csrf_token=39550324f7523f46fc7aeac357b328b4; passport_csrf_token_default=39550324f7523f46fc7aeac357b328b4; _ga_BZBQ2QHQSP=GS1.1.1725259640.4.0.1725259640.0.0.1638924138; _uetvid=33c80e2068f711ef972fd981a47f82ed; FPID=FPID2.2.HBV92YhBc3A1g3kJOSwPoVCfftVJRld0XznP9mHdbwA%3D.1712245261; FPAU=1.2.311373469.1725259641; tt_csrf_token=tA8ipgbD-9MEdnAJUo1I_oJPcHltmHtk5TRM; tt_chain_token=o/PYVCQg0O7jDfWKjZajVA==; sid_guard=90e19a2c05ebcaedb465c53e5ab73cee%7C1727600649%7C15552000%7CFri%2C+28-Mar-2025+09%3A04%3A09+GMT; sid_ucp_v1=1.0.0-KGRkMGRlZDk0YzFlZWRkMTlmNzA0NzM0NDcyNGJhNjZkMmY0NWRiYmUKGgiuiOmMwq_M2WUQibDktwYYsws4B0D0B0gEEAQaB3VzZWFzdDgiIDkwZTE5YTJjMDVlYmNhZWRiNDY1YzUzZTVhYjczY2Vl; ssid_ucp_v1=1.0.0-KGRkMGRlZDk0YzFlZWRkMTlmNzA0NzM0NDcyNGJhNjZkMmY0NWRiYmUKGgiuiOmMwq_M2WUQibDktwYYsws4B0D0B0gEEAQaB3VzZWFzdDgiIDkwZTE5YTJjMDVlYmNhZWRiNDY1YzUzZTVhYjczY2Vl; tta_attr_id_mirror=0.1727666844.7420272592944267280; part=stable; pre_country=SG; csrftoken=2s0hHtqOmT4VtDqKXn8B3MU29GLiogmd; ac_csrftoken=4922dda947894626845ead29f186a55c; pre_country=SG; ks_theme=1; ks_theme=1; tta_attr_id=0.1727667232.7420274014431690769; lang_type=zh; FPLC=7nLwqQDX29g75pqhABb9pmgrDbH690gONEfq%2FXL3oBTODnfFjkU91Mvc3Iy7Vfc3OPIlOvZQwVcUvm9cKszjllrQ8TlZ54I8lAYTew24n4JDWwWeIlhJUjCpfNNd7Q%3D%3D; s_v_web_id=verify_m1ogpuyf_5p0jtak4_2xb1_4nwK_BMYd_Me4YUthrxIno; d_ticket_ads=e9a6caf0d3fb7e5caeaf8db89078dac0f672e; sso_uid_tt_ads=fa20c17b8ca319171c4f85f7914ea0b743121a8958698ba86468d2a3727864b3; sso_uid_tt_ss_ads=fa20c17b8ca319171c4f85f7914ea0b743121a8958698ba86468d2a3727864b3; sso_user_ads=6e6dc93484ac486a76bbc769518dbce5; sso_user_ss_ads=6e6dc93484ac486a76bbc769518dbce5; sid_ucp_sso_v1_ads=1.0.0-KDVlOGFlZWExMTFjZWQ3MzY1MWM5ZDZiNjBmNTg3NjljYTlmNWMxOTQKIAiQiLXyleT892YQ47votwYYrwwgDDDP5r-3BjgBQOsHEAMaAm15IiA2ZTZkYzkzNDg0YWM0ODZhNzZiYmM3Njk1MThkYmNlNQ; ssid_ucp_sso_v1_ads=1.0.0-KDVlOGFlZWExMTFjZWQ3MzY1MWM5ZDZiNjBmNTg3NjljYTlmNWMxOTQKIAiQiLXyleT892YQ47votwYYrwwgDDDP5r-3BjgBQOsHEAMaAm15IiA2ZTZkYzkzNDg0YWM0ODZhNzZiYmM3Njk1MThkYmNlNQ; sid_guard_ads=ba9ed1e9de1f7ffc9c8d3c91b899eec3%7C1727667684%7C863998%7CThu%2C+10-Oct-2024+03%3A41%3A22+GMT; uid_tt_ads=9dbc4191e91f8425e9357f1afd055417dbeb13d0ad54b3519359694297ad414a; uid_tt_ss_ads=9dbc4191e91f8425e9357f1afd055417dbeb13d0ad54b3519359694297ad414a; sid_tt_ads=ba9ed1e9de1f7ffc9c8d3c91b899eec3; sessionid_ads=ba9ed1e9de1f7ffc9c8d3c91b899eec3; sessionid_ss_ads=ba9ed1e9de1f7ffc9c8d3c91b899eec3; sid_ucp_v1_ads=1.0.0-KDM4NDY5Njc1N2ZmYmQwNzMwNjZlMGZhOTczYWZlYmQzOWFhYzkxMWMKGgiQiLXyleT892YQ5LvotwYYrwwgDDgBQOsHEAMaAm15IiBiYTllZDFlOWRlMWY3ZmZjOWM4ZDNjOTFiODk5ZWVjMw; ssid_ucp_v1_ads=1.0.0-KDM4NDY5Njc1N2ZmYmQwNzMwNjZlMGZhOTczYWZlYmQzOWFhYzkxMWMKGgiQiLXyleT892YQ5LvotwYYrwwgDDgBQOsHEAMaAm15IiBiYTllZDFlOWRlMWY3ZmZjOWM4ZDNjOTFiODk5ZWVjMw; _ga_Y2RSHPPW88=GS1.1.1727666861.1.1.1727667796.0.0.492876027; msToken=-0G2nGU3WMsZDThv3VW5E7iEA-wwlbPQl4y7vs6jmLPlpWE00mp91nRICbMjVajhdRbq0_yyoggarvnyjw1c3kSW-8Pqrl9Xsk1S5cDMvKyPoFSRBAEDnJ37AwpqDz0aiSQbNw==; odin_tt=4a8a2e887f3982795ade0beedccc6ca9e41286bb36bc5af93da33f3637df787abcfe59020829101d258b3fd31a2307e2; _tea_utm_cache_1583={%22campaign_id%22:1811594297665633}; _tea_utm_cache_4697={%22campaign_id%22:1811594297665633}; _ga_HV1FL86553=GS1.1.1727683091.3.1.1727683775.0.0.237124379; _ga_ER02CH5NW5=GS1.1.1727683090.3.1.1727683777.0.0.1266278503; _ga_QQM0HPKD40=GS1.1.1727687716.8.0.1727687716.0.0.17754215; msToken=qwl3XfDsqi4Hqtp8luKNxYCLuUwKPAfSZc9IDLXQZsgAFZLRCAhnT4Yzxjq57KxzIun-oxn8mVwLSf169zka6FGlrXLxHv1U8tiOLmgl746bfvI8x3csqckkapQN; ttwid=1%7CbXC0BvPv03Sn9h4guF8ZejlVnbraWHD1xE8tiNSQSkE%7C1727689761%7C9a0d7c70d4f59bae1dc08356ba1be05be2f6e9a47b17f29458b7f000a21e9339",
      Referer:
        "https://ads.tiktok.com/i18n/creation/1nn/create/campaign?is_from_campaign_list=1&aadvid=7417667470661697537",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `{"campaign_sketch_form_data":{"industry_types":[],"campaign_app_profile_page_type":0,"lead_catalog_toggle":0,"po_number":"","app_id":"","dedicate_type":0,"skan4_campaign_structure_type":0,"rewarding_game_attestation":0,"universal_type":0,"search_campaign_type":0,"budget":"","budget_mode":-1,"budget_optimize_switch":0,"cbo_uniform_bid":0,"ab_test":0,"split_test_flag":0,"campaign_name":"znx商品销量20240930174944","campaign_snap_id":"","campaign_sketch_id":"","buying_type":1,"objective_type":15,"redesign_campaign_type":1,"app_campaign_type":0,"web_all_in_one_catalog":0,"brand_campaign_type":4,"ecomm_type":2},"clear_lower_level_sketches":false,"with_sketch":true,"is_skip_check_fields":true,"risk_info":{"cookie_enabled":true,"screen_width":1920,"screen_height":1080,"browser_language":"zh","browser_platform":"MacIntel","browser_name":"Mozilla","browser_version":"5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36","browser_online":true,"timezone_name":"Asia/Shanghai"}}`,
    method: "POST",
  }
)
  .then((response) => {
    return response.blob();
  })
  .then((response) => {
    const data = response.data;
    console.log(
      ">>>>获取campaign 信息，用户后续创建真正的 获取campaign",
      response
    );
    return data;
  });

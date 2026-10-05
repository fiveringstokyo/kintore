# 評価に使ったスクリプト

- `common.js` … Playwright（Chromium・iPhone 14・タッチ）でアプリを開き、タップ数・押した位置・44px 未満の押せる物・保存データを記録する部品。古い形（v1）の記録を作る `seedV1()` もここ。
- `personas.js` … ペルソナごとに動かす枠組み。
- `round5.js` … 最後の周の5人の操作（`node round5.js 出力先`）。
- `safety.js` … 記録を壊さんかの確かめ（古い形からの移し替え・控え・読み込み・lbs 表示）。

アプリを `http-server -p 8123` などで動かしてから実行する（Playwright と Chromium の場所はこの評価環境の物なので、使う所に合わせて直す）。

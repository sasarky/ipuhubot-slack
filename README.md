# IPUHubot
Slack の IPU でうごいている ipukun のための hubot script です  
他のところで動くかとかあまり考えてないです（ごめんなさい）

# 開発方法
## 新機能追加
基本的に `/script` の下にお願いします。  
汎用 class は `/src/class` にお願いします。

## 開発の流れ
### feature branch 作成
master branch の派生で作成してください
```
git checkout -b feature/hogefuga
```

### ごりごり作る
\.js でも \.coffee でもどっちでもいいです  
昔は js 派でしたが最近は coffee 派

### master branch に pull req を送ってレビューしてもらう
基本的に GitHub でやりとりします

### merge されたら
2014-11-11 から wercker という ci サービスでデプロイをしています。  
master に merge されたタイミングで勝手にデプロイされます

# ローカルでの動かし方
前提条件として coffee や hubot, redis などをインストールしておく必要があります  
このへんは基本的な hubot の動かし方なので manual とか見て頑張ってください

# その他
Happy Hacking

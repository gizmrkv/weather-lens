# weather-lens

気象庁アメダスの観測データ(現在の気温・湿度・本日の最高気温)を、観測地点マーカーの色分けで地図上に表示するWebアプリ。

公開URL: https://gizmrkv.github.io/weather-lens/

## 技術構成

- Next.js (App Router / TypeScript) の静的エクスポート、サーバーなし
- 地図: `Leaflet` + `react-leaflet`(タイルはOpenStreetMap、APIキー・アカウント登録不要)
- データ取得/キャッシュ: `@tanstack/react-query`
- 気象データ: 気象庁アメダスの非公式JSON([lib/amedas.ts](src/lib/amedas.ts)に集約)。クライアントから直接fetch(CORS許可を確認済み)
- デプロイ: GitHub Actions → GitHub Pages

## セットアップ

環境変数の設定は不要。

```bash
npm install
npm run dev
```

### GitHub Pagesへのデプロイ

このリポジトリはpush時に `.github/workflows/deploy.yml` が自動でビルド・デプロイする。必要な一回限りの設定:

- [x] リポジトリ Settings → Pages → Source を「GitHub Actions」に設定済み

## 地図タイルについて

地図タイルは[OpenStreetMap](https://www.openstreetmap.org/copyright)を利用しており、地図隅に帰属表示を出している。個人・低トラフィックの利用は[OSMの利用ポリシー](https://operations.osmfoundation.org/policies/tiles/)の範囲内。

## レイヤー

| レイヤー | 内容 | 配色 |
|---|---|---|
| 現在の気温 | 直近10分値 | 発散配色(寒色↔暖色、中立点15℃) |
| 現在の湿度 | 直近10分値 | 単色の連続配色(薄い→濃い) |
| 本日の最高気温 | 都道府県庁所在地相当の代表地点(約50件)を即時取得、他地点はクリックで個別取得しlocalStorageにキャッシュ | 気温と同じ発散配色 |

マーカーをクリックすると、気温・湿度・本日の最高/最低/平均気温を表示する。

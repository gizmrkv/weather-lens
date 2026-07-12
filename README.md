# weather-lens

気象庁アメダスの観測データ(現在の気温・湿度・本日の最高気温)を、観測地点マーカーの色分けでGoogle Map上に表示するWebアプリ。

公開URL: https://gizmrkv.github.io/weather-lens/

## 技術構成

- Next.js (App Router / TypeScript) の静的エクスポート、サーバーなし
- 地図: `@vis.gl/react-google-maps`(`AdvancedMarker`)
- データ取得/キャッシュ: `@tanstack/react-query`
- 気象データ: 気象庁アメダスの非公式JSON([lib/amedas.ts](src/lib/amedas.ts)に集約)。クライアントから直接fetch(CORS許可を確認済み)
- デプロイ: GitHub Actions → GitHub Pages

## セットアップ

### 1. Google Maps APIキー / Map IDの作成(手動)

[Google Cloud Console](https://console.cloud.google.com/)で以下を行う:

1. Maps JavaScript APIを有効化し、APIキーを作成
2. Map Management で Map ID を作成(`AdvancedMarker` の描画に必須)
3. APIキーをHTTPリファラーで制限
   - 本番: `https://gizmrkv.github.io/*`
   - ローカル開発用に許可する場合: `http://localhost:3000/*`

### 2. ローカル開発

```bash
cp .env.example .env.local
# .env.local に NEXT_PUBLIC_GOOGLE_MAPS_API_KEY / NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID を設定
npm install
npm run dev
```

`NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` を未設定のまま試す場合は `DEMO_MAP_ID` にフォールバックする(動作確認用、本番では使わない)。

### 3. GitHub Pagesへのデプロイ

このリポジトリはpush時に `.github/workflows/deploy.yml` が自動でビルド・デプロイする。必要な一回限りの設定:

- [x] リポジトリ Settings → Pages → Source を「GitHub Actions」に設定済み
- [x] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` / `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` をリポジトリシークレットに登録済み(`gh secret set`)

上記が未設定の場合は、手順1で取得した値を使って以下を実行する:

```bash
gh secret set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
gh secret set NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
```

## レイヤー

| レイヤー | 内容 | 配色 |
|---|---|---|
| 現在の気温 | 直近10分値 | 発散配色(寒色↔暖色、中立点15℃) |
| 現在の湿度 | 直近10分値 | 単色の連続配色(薄い→濃い) |
| 本日の最高気温 | 都道府県庁所在地相当の代表地点(約50件)を即時取得、他地点はクリックで個別取得しlocalStorageにキャッシュ | 気温と同じ発散配色 |

マーカーをクリックすると、気温・湿度・本日の最高/最低/平均気温を表示する。

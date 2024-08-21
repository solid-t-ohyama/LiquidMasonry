# Liquid Masonry

Liquid Masonryは、ウェブページ上で動的かつレスポンシブなマスレイアウトを実現するための軽量なJavaScriptライブラリです。このライブラリは、コンテナの幅に応じて自動的に要素の配置を調整し、カスタマイズ可能なブレークポイントやアイテムのサイズを柔軟にサポートします。

## 特徴

- **レスポンシブレイアウト**: デバイスの画面サイズに応じて最適なグリッド列数を自動的に計算。
- **カスタマイズ可能なブレークポイント**: 画面幅に基づいてレイアウトを調整するための柔軟なブレークポイント設定が可能。
- **柔軟なアイテムサイズ**: グリッド内の異なるアイテム幅をサポートし、よりダイナミックなレイアウトを実現。
- **画像の読み込み監視**: 画像の読み込み完了後にレイアウトが適切に更新されるよう自動調整。
- **Resize Observer対応**: アイテムがリサイズされた際にレイアウトを自動的に再計算し、常に最適な表示を維持。

## インストール

Liquid Masonryをプロジェクトに導入するには、以下の手順で`import.min.js`ファイルをダウンロードし、HTMLファイルに組み込みます。

```html
<script src="path/to/liquidmasonry/import.min.js"></script>
```

## 使い方

Liquid Masonryを使用するには、以下の例のようにオプションを指定して初期化します。

### HTML構造

```html
<div class="masonry">
  <div class="items">アイテム1</div>
  <div class="items" data-col-width="2">アイテム2</div>
  <div class="items">アイテム3</div>
  <!-- 他のアイテム -->
</div>
```

- **data-col-width** 属性を使用することで、複数列にまたがるアイテムを定義することができます。

### JavaScriptでの初期化

```javascript
document.addEventListener("DOMContentLoaded", function() {
  new LiquidMasonry({
    containerSelector: ".masonry",
    itemSelector: ".items",
    brakePoints: [
      { brakePoint: 500, grid: 2, gapRatioX: 0.02, gapRatioY: 0.02 },
      { brakePoint: 768, grid: 3, gapRatioX: 0.03, gapRatioY: 0.03 },
      { brakePoint: 1024, grid: {itemMinWidth: 200, itemMaxWidth: 400}, gapRatioX: 0.04, gapRatioY: 0.04 },
    ],
    gapMin: 10,
    gapMax: 30,
    brakeTargetSelector: "window",  // デフォルトは window
    initialStyle: true,  // 必須スタイルを適用
    debug: false,  // デバッグモードの有効/無効
  });
});
```

### オプション

- **containerSelector**: コンテナ要素のCSSセレクタ。
- **itemSelector**: グリッドアイテムのCSSセレクタ。
- **brakePoints**: グリッドレイアウトとギャップを特定の画面幅で定義するオブジェクトの配列。
- **brakeTargetSelector**: ブレークポイントを判定する要素のセレクタ。デフォルトは`window`ですが、別の要素を指定することもできます。
- **gapMin**: アイテム間の最小ギャップ。
- **gapMax**: アイテム間の最大ギャップ。
- **initialStyle**: コンテナとアイテムに必須のスタイル（`position:relative/absolute`）を適用するかどうか。
- **onInitialized**: 初期化時に実行するコールバック関数。
- **onUpdate**: レイアウトが更新された際に実行するコールバック関数。
- **debug**: デバッグモードを有効にして、コンソールにレイアウト計算のログを出力します。

#### brakePoints オプション

`brakePoints`オプションは、以下のプロパティを持つオブジェクトの配列として指定します。

- **brakePoint**: 画面幅がこの数値以上になった時に適用される（より大きな画面幅のブレークポイントが優先されます）。
- **grid**: 列数またはアイテムの幅を範囲指定する数値またはオブジェクト。
- **gapRatioX**: 左右のマージンをコンテナの幅の割合（0〜1）で指定。
- **gapRatioY**: 上下のマージンをコンテナの幅の割合（0〜1）で指定。

#### grid プロパティ

`grid`プロパティに以下のオブジェクトを渡すことで、アイテムの幅を指定し、列数を動的に算出して表示します。

- **itemMinWidth**: 最小幅を指定。
- **itemMaxWidth**: 最大幅を指定。

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。

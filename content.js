// BookWalker All Checking Content Script

// 指定された要素をすべてクリックする関数
function clickAllCheckboxes() {
  const checkElements = document.querySelectorAll(
    'span.a-check[data-on-class="a-check--on"][data-off-class="a-check"]'
  );

  if (checkElements.length === 0) {
    console.log("BookWalker All Checking: チェック要素が見つかりませんでした");
    return;
  }

  console.log(
    `BookWalker All Checking: ${checkElements.length}個のチェック要素を見つけました`
  );

  // 各要素を順番にクリック（少し間隔をあけて）
  checkElements.forEach((element, index) => {
    setTimeout(() => {
      // 要素が表示されていて、クリック可能な場合のみクリック
      if (element.offsetParent !== null) {
        element.click();
        console.log(
          `BookWalker All Checking: ${index + 1}番目の要素をクリックしました`
        );
      }
    }, index * 100); // 100ms間隔でクリック
  });
}

// カスタムボタンを作成してページに追加する関数
function createAllCheckButton() {
  // 既にボタンが存在する場合は追加しない
  if (document.getElementById("bw-all-check-btn")) {
    return;
  }

  // ボタン要素を作成
  const buttonDiv = document.createElement("div");
  buttonDiv.className = "btn-series-reservation";
  buttonDiv.id = "bw-all-check-btn";

  const button = document.createElement("a");
  button.href = "javascript:void(0)";
  button.className = "a-basic-btn--reserve";
  button.setAttribute("data-ga-category", "bw_all_check");

  // テキストを追加
  const textSpan = document.createElement("span");
  textSpan.className = "btn-txt";
  textSpan.textContent = "全てチェック";

  button.appendChild(textSpan);
  buttonDiv.appendChild(button);

  // クリックイベントを追加
  button.addEventListener("click", function (e) {
    e.preventDefault();

    // 実行中の視覚フィードバック
    button.classList.add("executing");
    textSpan.textContent = "実行中...";

    clickAllCheckboxes();

    // 完了の視覚フィードバック
    setTimeout(() => {
      button.classList.remove("executing");
      button.classList.add("completed");
      textSpan.textContent = "完了！";
    }, 500);

    // 元の状態に戻す
    setTimeout(() => {
      button.classList.remove("completed");
      textSpan.textContent = "全てチェック";
    }, 2500);
  });

  // ボタンを挿入する場所を探す
  const actionsDiv = document.querySelector(".o-list--actions");
  if (actionsDiv) {
    // 「シリーズ予約購入」ボタンの左隣に追加
    const reservationDiv = actionsDiv.querySelector(".btn-series-reservation");
    if (reservationDiv) {
      reservationDiv.parentNode.insertBefore(buttonDiv, reservationDiv);
      console.log(
        "BookWalker All Checking: カスタムボタンを「シリーズ予約購入」の左隣に追加しました"
      );
    } else {
      // 予約購入ボタンが見つからない場合は先頭に追加
      actionsDiv.insertBefore(buttonDiv, actionsDiv.firstChild);
      console.log(
        "BookWalker All Checking: カスタムボタンを先頭に追加しました"
      );
    }
  }
}

// 自動実行用の関数
function autoClickOnLoad() {
  // ページが完全に読み込まれるまで少し待つ
  setTimeout(() => {
    clickAllCheckboxes();
  }, 1000);
}

// ページが読み込まれた時にボタンを追加
function initializeExtension() {
  // DOM要素が読み込まれるまで待つ
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(createAllCheckButton, 500);
    });
  } else {
    setTimeout(createAllCheckButton, 500);
  }

  // 動的コンテンツの変更を監視してボタンを再追加
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        // .o-list--actionsが追加された場合にボタンを再作成
        const actionsDiv = document.querySelector(".o-list--actions");
        if (actionsDiv && !document.getElementById("bw-all-check-btn")) {
          setTimeout(createAllCheckButton, 100);
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// ページロード時に自動実行（オプション）
// autoClickOnLoad();

// 拡張機能の初期化
initializeExtension();

console.log("BookWalker All Checking: Content script loaded");

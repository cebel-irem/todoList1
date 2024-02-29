const todoValue = document.getElementById("todoText"),
  listItems = document.getElementById("list-items"),
  addUpdateClick = document.getElementById("AddUpdateClick");
AlertMessage = document.getElementById("AlertMessage");

let updateText;
let todoData = JSON.parse(
  localStorage.getItem("todoData"),
); /**localStorage'da depolanan json öğesini çekmek için. Değerler kapatıp açtığımızda kaybolmasını istemiyorsak bunu kullanmamız gerek/  */
if (!todoData) {
  /**Değer null mu diye kontrol eder  */
  todoData = [];
}

todoValue.addEventListener("keypress", function (e) {
  /** Enter Tuşuna basıldığında görev ekleyebilmesi için bir fonksiyon yazdık */
  SetAlertMessage("");
  if (e.key == "Enter") {
    addUpdateClick.click();
  }
});

ReadToDoItems(); /**Fonksiyonu çağırıyoruz */
function ReadToDoItems() {
  /** todoData adlı dizideki verileri okutmak için bu fonksiyonu kullanacağız */
  console.log(todoData); /** Consola yazdırır */

  /** Elemanlar için bir döngü oluşturuyoruz */
  todoData.forEach((element) => {
    let li = document.createElement("li"); /** li öğesi oluşturma */
    let style = "";

    if (element.status) {
      style = 'style="text-decoration: line-through"';
    }

    const todoItems = `<div ${style} ondblclick="CompleteToDoItems(this)">
                          ${element.items}
                          ${
                            style === ""
                              ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" />'
                              : ""
                          }
                          <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png" />
                       </div>`;

    li.innerHTML = todoItems;
    listItems.appendChild(li);
  });
}

function CreateToDoData() {
  console.log(todoValue.value); /*Konsolo value değişkeninin değerini yazdırır*/
  if (todoValue.value === "") {
    /** Burada değer boş mu değil mi diye kontor ediyor */
    AlertMessage("Lütfen bir şeyler yazın"); /*Eğer boşsa urarı mesajı verecek*/
    todoValue.focus(); /* Kullanıcıyı input alanına odaklanmaya yönlendir */
  }

  let li = document.createElement("li");
  const todoItems = `<div ondblclick="CompleteToDoItems(this)">${todoValue.value}</div><div><img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="pencil.png" /><img class="delete todo-controls" onclick= "DeleteToDoItems(this)" src="delete.png"></div>`;
  li.innerHTML = todoItems;
  listItems.appendChild(li);

  /**input alanının değerini temizlemek için: */
  todoValue.value = "";
  if (!todoData) {
    todoData = []; /** boş dizi atıyor */
  }
  /** boş değer atamamızı sağlayacak kodlar */
  let dataItem = { item: todoData.value, status: false };
  todoData.push(dataItem); /**eklme yapıyoruz(push) */
  localStorage.setItem("todoData", JSON.stringify(todoData));

  todoValue.value = "";
  SetAlertMessage("Görev Listeye Eklendi");
}

/*Tamamlanan Görevin üstünü çizmek için bir fonksiyon yazıyoruz */
function CompleteToDoItems(e) {
  /**Burada ifadenenin üstü çizili mi değil mi diye kontrol ediyoruz */
  if (e.parentElement.querySelector("div").style.textDecoration === "") {
    e.parentElement.querySelector("div").style.textDecoration = "line-through";
    e.parentElement.querySelector("img.edit").remove();

    todoData.forEach((element) => {
      if (
        e.parentElement.querySelector("div".innerText.trim() == element.item)
      ) {
        element.status = true;
      }
    });
  }
}

function UpdateOnSelectionItems() {
  /** Seçilen yazılmış görevi düzeltmek için bu fonksiyonun kullanacağız */
  updateText.innerText = todoValue.value;

  todoData.forEach((element) => {
    if (element.item == updateText.innerText.trim()) {
      element.item = todoValue.value;
    }
  });

  setLocalStorage();
}

function UpdateToDoItems(e) {
  if (
    e.parentElement.parentElement.querySelector("div").style.textDecoration ===
    ""
  ) {
    todoValue.value =
      e.parentElement.parentElement.querySelector("div").innerText;
    addUpdateClick.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdateClick.setAttribute("src", "refresh.png");
    updateText = e.parentElement.parentElement.querySelector("div");
  }
}

function DeleteToDoItems(e) {
  /** Görevi silmek için bir fonksiyon tanımlıyoruz */
  let deleteValue =
    e.parentElement.parentElement.querySelector("div").innerText;
  if (confirm(`Görevi silmek istediğinize emin misiniz? ${deleteValue}!`)) {
    /** Uyarı mesajı */
    e.parentElement.parentElement.parentElement
      .querySelector("li")
      .remove(); /**Silme komutu */
    e.parentElement.parentElement.setAttribute("class", "deleted-item");
    todoValue.focus();

    todoData.forEach((element) => {
      if (element.item == deleteValue.trim()) {
        todoData.splice(element, 1);
      }
    });
    setLocalStorage();
    SetAlertMessage("Görev Siliniyor");
  }
}

function setLocalStorage() {
  localStorage.setItem("todoData", JSON.stringify(todoData));
}

function SetAlertMessage(message) {
  AlertMessage.removeAttribute("class");
  AlertMessage.innerText = message;

  setTimeout(() => {
    AlertMessage.classList.add("toggleMe");
  }, 1000);
}

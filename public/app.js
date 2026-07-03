async function load() {
  const res = await fetch("/list");
  const data = await res.json();

  document.getElementById("list").innerHTML =
    data.map(i => `
      <div class="card">
        <h3>${i.title}</h3>
        <p>฿ ${i.price}</p>
        <small>${i.type}</small>
      </div>
    `).join("");
}

load();

async function addItem() {
  await fetch("/add", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      title: title.value,
      price: price.value,
      type: type.value
    })
  });

  load();
}

async function book() {
  const res = await fetch("/book", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      name: name.value,
      phone: phone.value,
      service: service.value
    })
  });

  const data = await res.json();

  if (data.ok) alert("จองสำเร็จ");
}
const data = {
    name:"taro",
    age:19
}

async function fetchjson(){
    const body = new FormData();
    body.append("name",data.name);
    body.append("age",data.age);
    console.log(data.name);
    console.log(data.age);
    const method="post";
    const filename="index.php";
    const res = await fetch(filename,{body,method});
    const users = await res.json();
    console.log(res);
    console.log(users);
}
fetchjson();

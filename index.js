function main(){
    const userId = getUserId();
    getUserInfo(userId)
    //Promiseチェーン
    .then((userInfo) => createView(userInfo))
    .then((view) => displayView(view))
    .catch((error) => {
        console.log(`エラーが発生しました(${error})`);
    });
}

function getUserInfo(userId){
    return new Promise((resolve,reject) => {
        const request = new XMLHttpRequest();
        request.open("GET",`https://api.github.com/users/${userId}`);//''ではなく``
        request.addEventListener("load",(event) => {
            if(event.target.status !== 200){
                reject(new Error(`${event.target.status}: ${event.target.statusText}`));
            }
            const userInfo = JSON.parse(event.target.responseText);
            resolve(userInfo);
        });
        request.addEventListener("error",() => {
        reject(new Error("Network error"));
    });
    request.send();
});
}

function getUserId(){
    const value = document.getElementById("userId").value;
    return encodeURIComponent(value);
}

function createView(userInfo){
    return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
        <dt>Location</dt>
        <dd>${userInfo.location}</dd>
        <dt>Repositories</dt>
        <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
}

function displayView(view){
    const result = document.getElementById("result");
    result.innerHTML = view;
}

//HTML文字列エスケープ
function scapeSpecialChars(str){
    return str
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

function escapeHTML(strings,...values){
    return strings.reduce((result,str,i)=> {
        const value = values[i - 1];
        if(typeof value === "string"){
            return result + scapeSpecialChars(value) + str;
        }else{
            return result + String(value) + str;
        }
    });
}

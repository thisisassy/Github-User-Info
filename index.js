function main() {
    const userId = getUserId();
    getUserInfo(userId)
        .then((getUserInfo) => createView(getUserInfo))
        .then((view) => displayView(view))
        .catch((error) => {
            console.error(`エラーが発生しました (${error})`);
        });
}

function getUserInfo(userId) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", `https://api.github.com/users/${userId}`);
        request.addEventListener("load", (event) => {
            if (event.target.status !== 200) {
                console.error(`${event.target.status}: ${event.target.statusText}`);
                reject();
            }
            const userInfo = JSON.parse(event.target.responseText);
            resolve(userInfo);
        });
        request.addEventListener("error", () => {
            console.log("Network Error");
            reject();
        });
        request.send();
    });

}

function getUserId() {
    const value = document.getElementById("userId").value;
    return encodeURIComponent(value);
}

function createView(userInfo) {
    return escapeHTML ` 
<img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
<h4>${userInfo.name} (@${userInfo.login})</h4>

    <div>
        <h4>Location</h4>
        <p>${userInfo.location}</p>
        <b>Repositories</b>
        <p>${userInfo.public_repos}</p>
    </div>`;
}

function displayView(view) {
    const result = document.getElementById("result");
    result.innerHTML = view;
}

function escapeSpecialChars(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeHTML(strings, ...values) {
    return strings.reduce((result, string, i) => {
        const value = values[i - 1];
        if (typeof value === "string") {
            return result + escapeSpecialChars(value) + string;
        } else {
            return result + String(value) + string;
        }
    });
}

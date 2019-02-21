const { app, BrowserWindow } = require('electron')

const USERNAME = 'schneiderm'
const PASSWORD = 'HERE GOES YOUR PASSWORD'
const FULL_NAME = 'SCHNEIDER Matti'  // full name as registered in the Outlook web app, used to detect a successful login


app.once('ready', () => {
    const token = new BrowserWindow({ width: 500, height: 200 })
    token.loadURL(`file://${__dirname}/token.html`)

    const appChooserWindow = new BrowserWindow({ show: false })
    appChooserWindow.loadURL('https://portalis.diplomatie.gouv.fr/')

    token.on('page-title-updated', (event, tokenValue) => {
        if (tokenValue == 'Token') return 'initial load';
        console.log('2FA obtained')
        token.close()
        appChooserWindow.show()
        console.log('Outer login')

        login(appChooserWindow, USERNAME, tokenValue)
            .then(whenTitleBecomes('F5 Dynamic Webtop'))
            .then(selectWebmailIcon)
            .then(getWebmailWindow)
            .then(whenTitleBecomes('Outlook Web App'))
            .then(webmailWindow => {
                return webmailWindow.webContents.executeJavaScript('document.getElementById("rdoPrvt").click()')  // select "private computer" radio button
                    .then(_ => login(webmailWindow, USERNAME, PASSWORD))
            }).then(whenTitleBecomes(`${FULL_NAME} - Outlook Web App`))
            .then(webmailWindow => {
                appChooserWindow.hide()  // if closed, would close its child webmailWindow as well
                webmailWindow.setFullScreen(true)
            })
    })
})

function login(webview, username, password) {
    return setInput(webview, 'username', username)
        .then(_ => setInput(webview, 'password', password))
        .then(_ => webview.webContents.executeJavaScript('document.querySelector("input[type=submit]").click()'))
        .then(_ => webview)
}

function setInput(webview, inputName, value) {
    return webview.webContents.executeJavaScript(`document.querySelector("input[name=${inputName}]").value = "${value}"`)
}

function selectWebmailIcon(view) {
    return view.webContents.executeJavaScript('document.querySelector("[class=image]").click()')
}

function getWebmailWindow() {
    return BrowserWindow.getAllWindows().find(window => window.getTitle() == '_blank')
}

function whenTitleBecomes(expectedTitle) {
    return function(window) {
        return new Promise((resolve, reject) => {
            window.on('page-title-updated', (event, title) => {
                if (title == expectedTitle)
                    resolve(window, title)
            })
        })
    }
}

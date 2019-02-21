const { app, BrowserWindow } = require('electron')

const USERNAME = 'schneiderm'
const PASSWORD = 'HERE GOES YOUR PASSWORD'


app.once('ready', () => {
    const token = new BrowserWindow({ width: 500, height: 200 })
    token.loadURL(`file://${__dirname}/token.html`)

    const webmail = new BrowserWindow({ show: false })
    webmail.loadURL('https://portalis.diplomatie.gouv.fr/')

    token.on('page-title-updated', (event, tokenValue) => {
        if (tokenValue == 'Token') return 'initial load';
        token.close()
        webmail.show()
        autofillOuterLogin(webmail, tokenValue)
    })

    webmail.on('page-title-updated', (event, title) => {
        if (title == 'F5 Dynamic Webtop') {  // first login successful, select the app to use
            selectWebmailIcon(webmail)
                .then(getWebmailWindow)
                .then(webmailWindow => {
                    webmailWindow.on('page-title-updated', (event, title) => {
                        if (title == 'Outlook Web App')
                            autofillInnerLogin(webmailWindow, PASSWORD)
                    })
                })
        }
    })
})


function autofillOuterLogin(view, password) {
    console.log('Outer login')

    view.webContents.executeJavaScript(`document.querySelector("input[name=username]").value = "${USERNAME}"`)
    view.webContents.executeJavaScript(`document.querySelector("input[name=password]").value = "${password}"`)
    view.webContents.executeJavaScript('document.querySelector("input[type=submit]").click()')
}

function selectWebmailIcon(view) {
    console.log('Choosing webmail app')

    return view.webContents.executeJavaScript('document.querySelector("[class=image]").click()')
}

function getWebmailWindow() {
    console.log('Identifying webmail window')

    return BrowserWindow.getAllWindows().find(window => {
        return window.getTitle() == '_blank'
    })
}

function autofillInnerLogin(view, password) {
    console.log('Inner login')

    view.webContents.executeJavaScript('document.getElementById("rdoPrvt").click()')
    view.webContents.executeJavaScript(`document.getElementById("username").value = "${USERNAME}"`)
    view.webContents.executeJavaScript(`document.getElementById("password").value = "${password}"`)
    view.webContents.executeJavaScript('document.querySelector("input[type=submit]").click()')
}

// ===== 商务邀约 · 俏皮连环劝(精简版:5 轮) =====
// 每点一次「没空」,小璐换一套说辞继续劝;劝完按钮开始耍赖逃跑;
// 最后点到「没空」触发终极诚意,满屏「收到,准时到」。

// 每一轮劝说:标题 + 按钮文字 + 配图
const persuasions = [
    {
        title: "就占用您 30 分钟,茶都替您沏好了,<br>真的不赏个脸么?🥺☕",
        no: "没空 🙅",
        gif: "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif"
    },
    {
        title: "8月25日下午 15:00,地点全听您的,<br>您在哪儿小璐就到哪儿 📍",
        no: "还是没空",
        gif: "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif"
    },
    {
        title: "这次聊的事,对您只有好处没有坑,<br>小璐拿芝麻信用做担保 🤝✨",
        no: "说啥都没空",
        gif: "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif"
    },
    {
        title: "聊得不投机您随时起身走,<br>小璐绝不纠缠,还倒贴一杯咖啡 ☕😭",
        no: "咖啡也没空",
        gif: "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif"
    },
    {
        title: "行…好话说尽了,<br>那小璐只能不讲武德了 😈",
        no: "你能咋滴",
        gif: "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"
    }
]

// 逃跑阶段的嘲讽
const dodgeTeases = [
    "哎呀徐峰先生手滑了?😜",
    "您的手速藏不住想来的心 😏",
    "点「好,安排」多省事嘛",
    "逃避可耻,而且没用",
    "别追啦,省点力气 25 号用 😝"
]

// 一开始就点「好,安排」时的调戏
const yesTeasePokes = [
    "哦?徐峰先生这么爽快?先点一下「没空」听听小璐怎么劝 😏",
    "别急着答应,点「没空」看看会发生什么 👀",
    "去点「没空」啊,我看您敢不敢 😈"
]

let round = 0             // 劝说进行到第几轮
let dodgeCount = 0
let yesTeasedCount = 0
let runawayEnabled = false
let surrenderMode = false
let forced = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const title = document.getElementById('main-title')
const subtitle = document.getElementById('subtitle')
const music = document.getElementById('bg-music')

// 音乐:先静音自动播,绕过浏览器限制
music.muted = true
music.volume = 0.3
music.play().then(() => { music.muted = false }).catch(() => {
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (round === 0 && dodgeCount === 0) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTease(msg)
        return
    }
    window.location.href = 'yes.html'
}

function handleNoClick() {
    // 投降阶段:终于点到「没空」→ 终极诚意
    if (surrenderMode) {
        triggerForce()
        return
    }

    // 逃跑阶段兜底:就算真点到了也算它逃掉
    if (runawayEnabled) {
        dodge()
        return
    }

    // 换下一套说辞继续劝
    if (round < persuasions.length) {
        const p = persuasions[round]
        setTitle(p.title)
        noBtn.textContent = p.no
        swapGif(p.gif)
        round++

        if (round < persuasions.length) subtitle.textContent = `—— 小璐劝说 · 第 ${round} 轮 ——`
        else subtitle.textContent = "—— 劝说结束,进入耍赖环节 ——"

        growYes()

        // 最后一套说辞出现后,按钮开始逃跑
        if (round === persuasions.length) enableRunaway()
    }
}

function setTitle(html) {
    title.style.opacity = '0'
    setTimeout(() => {
        title.innerHTML = html
        title.style.opacity = '1'
    }, 180)
}

function growYes() {
    const cur = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${Math.min(cur * 1.18, 54)}px`
    const grow = round + Math.floor(dodgeCount / 2)
    const padY = Math.min(18 + grow * 4, 50)
    const padX = Math.min(45 + grow * 7, 100)
    yesBtn.style.padding = `${padY}px ${padX}px`
}

function enableRunaway() {
    runawayEnabled = true
    noBtn.addEventListener('mouseover', dodge)
    noBtn.addEventListener('touchstart', dodge, { passive: true })
}

function dodge() {
    if (surrenderMode || forced) return
    dodgeCount++

    // 躲 5 次后假装投降
    if (dodgeCount >= 5) {
        surrender()
        return
    }

    const margin = 16
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin
    noBtn.style.position = 'fixed'
    noBtn.style.left = `${Math.random() * maxX + margin / 2}px`
    noBtn.style.top = `${Math.random() * maxY + margin / 2}px`
    noBtn.style.zIndex = '50'

    showTease(dodgeTeases[dodgeCount % dodgeTeases.length])
    if (dodgeCount >= 3) {
        const size = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(size * 0.9, 11)}px`
    }
    if (dodgeCount % 2 === 0) growYes()
}

function surrender() {
    surrenderMode = true
    noBtn.style.position = 'fixed'
    noBtn.style.left = '50%'
    noBtn.style.top = '75%'
    noBtn.style.transform = 'translate(-50%, -50%)'
    noBtn.textContent = "行,让您点 😔"
    setTitle("行行行,您赢了…<br>这次它真的不跑了 🤝")
    subtitle.textContent = "(小璐已哭晕,最后的倔强)"
    showTease("来吧,真的可以点了,骗您是小狗")
    swapGif("https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif")
}

// 点到「没空」→ 终极诚意 + 满屏「收到,准时到」
function triggerForce() {
    if (forced) return
    forced = true
    const overlay = document.getElementById('force-overlay')
    overlay.classList.add('show')

    const fill = document.getElementById('progress-fill')
    setTimeout(() => { fill.style.width = '100%' }, 100)

    setTimeout(() => {
        const box = overlay.querySelector('.force-box')
        box.querySelector('.force-title').textContent = "🥺 诚意加载完毕"
        box.querySelector('.force-sub').textContent = "小璐替您回复好了:收到,准时到(点哪都一样 😌)"
        rainYesButtons(overlay)
        setTimeout(() => { window.location.href = 'yes.html' }, 4500)
    }, 2200)
}

function rainYesButtons(overlay) {
    for (let i = 0; i < 26; i++) {
        setTimeout(() => {
            const b = document.createElement('button')
            b.className = 'rain-btn'
            b.textContent = '收到,准时到 ✅'
            b.style.left = `${Math.random() * 82}%`
            b.style.top = `${Math.random() * 88}%`
            b.style.animationDelay = `${Math.random() * 0.2}s`
            b.onclick = () => { window.location.href = 'yes.html' }
            overlay.appendChild(b)
        }, i * 90)
    }
}

function showTease(msg) {
    const toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2200)
}

function swapGif(src) {
    if (catGif.src === src) return
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 180)
}

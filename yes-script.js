let musicPlaying = false

window.addEventListener('load', () => {
    launchConfetti()

    // 自动盖时间戳
    const now = new Date()
    const pad = n => String(n).padStart(2, '0')
    document.getElementById('cert-time').textContent =
        `确认时间:${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${pad(now.getHours())}:${pad(now.getMinutes())}`

    // 能到这页说明点过按钮,音乐可以直接放
    const music = document.getElementById('bg-music')
    music.volume = 0.3
    music.play().catch(() => {})
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔊'
})

function launchConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#4CAF50', '#8BC34A', '#fff', '#ffdf00']
    const duration = 6000
    const end = Date.now() + duration

    confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors
    })

    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval)
            return
        }
        confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors })
        confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors })
    }, 300)
}

function toggleMusic() {
    const music = document.getElementById('bg-music')
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

// ========== GRID LIGHTS CANVAS ==========
var gridCanvas = document.createElement('canvas');
gridCanvas.id = 'gridLights';
gridCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
document.body.appendChild(gridCanvas);

var gridCtx = gridCanvas.getContext('2d');
var gridSize = 40;
var gridLights = [];
var gridLightCount = 12;

function resizeGridCanvas() {
    gridCanvas.width = window.innerWidth;
    gridCanvas.height = window.innerHeight;
}

resizeGridCanvas();
window.addEventListener('resize', function() {
    resizeGridCanvas();
    createGridLights();
});

function createGridLights() {
    gridLights = [];
    var cols = Math.floor(gridCanvas.width / gridSize);
    var rows = Math.floor(gridCanvas.height / gridSize);
    
    for (var i = 0; i < gridLightCount; i++) {
        var startCol = Math.floor(Math.random() * cols);
        var startRow = Math.floor(Math.random() * rows);
        var endCol = Math.floor(Math.random() * cols);
        var endRow = Math.floor(Math.random() * rows);
        
        // Движемся сначала по X, потом по Y (L-образный путь по сетке)
        gridLights.push({
            startCol: startCol,
            startRow: startRow,
            endCol: endCol,
            endRow: endRow,
            cornerCol: endCol,
            cornerRow: startRow,
            phase: 0, // 0 = движемся по X к углу, 1 = движемся по Y к цели
            progress: 0,
            speed: Math.random() * 0.008 + 0.004,
            size: 2,
            color: ['#39FF14', '#00E5FF', '#FF00FF'][Math.floor(Math.random() * 3)]
        });
    }
}

createGridLights();

function drawGridLights() {
    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    
    var cols = Math.floor(gridCanvas.width / gridSize);
    var rows = Math.floor(gridCanvas.height / gridSize);
    
    for (var i = 0; i < gridLights.length; i++) {
        var l = gridLights[i];
        
        l.progress += l.speed;
        
        if (l.progress >= 1) {
            l.progress = 0;
            if (l.phase === 0) {
                // Закончили X, начинаем Y
                l.phase = 1;
            } else {
                // Закончили маршрут, выбираем новый
                l.startCol = l.endCol;
                l.startRow = l.endRow;
                l.endCol = Math.floor(Math.random() * cols);
                l.endRow = Math.floor(Math.random() * rows);
                l.cornerCol = l.endCol;
                l.phase = 0;
            }
        }
        
        // Вычисляем текущую позицию
        var x, y;
        if (l.phase === 0) {
            // Движемся по горизонтали от start к corner
            var fromX = l.startCol * gridSize + gridSize / 2;
            var toX = l.cornerCol * gridSize + gridSize / 2;
            x = fromX + (toX - fromX) * l.progress;
            y = l.startRow * gridSize + gridSize / 2;
        } else {
            // Движемся по вертикали от corner к end
            x = l.cornerCol * gridSize + gridSize / 2;
            var fromY = l.startRow * gridSize + gridSize / 2;
            var toY = l.endRow * gridSize + gridSize / 2;
            y = fromY + (toY - fromY) * l.progress;
        }
        
        // Свечение
        var glow = gridCtx.createRadialGradient(x, y, 0, x, y, 8);
        glow.addColorStop(0, l.color);
        glow.addColorStop(0.3, l.color.replace(')', ', 0.5)').replace('rgb', 'rgba'));
        glow.addColorStop(1, 'transparent');
        
        gridCtx.beginPath();
        gridCtx.arc(x, y, 8, 0, Math.PI * 2);
        gridCtx.fillStyle = glow;
        gridCtx.fill();
        
        // Яркая точка
        gridCtx.beginPath();
        gridCtx.arc(x, y, l.size, 0, Math.PI * 2);
        gridCtx.fillStyle = l.color;
        gridCtx.shadowBlur = 10;
        gridCtx.shadowColor = l.color;
        gridCtx.fill();
        gridCtx.shadowBlur = 0;
    }
    
    requestAnimationFrame(drawGridLights);
}

drawGridLights();

// ========== HERO PARTICLES ==========
var canvas = document.getElementById('particles');
var ctx = canvas.getContext('2d');
var particles = [];
var particleCount = 50;

function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (var i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.3 + 0.1,
        speedX: Math.random() * 0.2 - 0.1,
        opacity: Math.random() * 0.5 + 0.1
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(57, 255, 20, ' + p.opacity + ')';
        ctx.fill();
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(57, 255, 20, 0.5)';
        
        p.y -= p.speedY;
        p.x += p.speedX;
        
        if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
    }
    
    requestAnimationFrame(drawParticles);
}

drawParticles();

// ========== COPY VPN LINK ==========
document.getElementById('copyBtn').addEventListener('click', function() {
    var vpnLink = 'https://gist.githubusercontent.com/zorka-project/efc486572e465d9fb6698264e9895f59/raw/kuertov-project.txt';
    var notification = document.getElementById('copyNotification');
    var btn = this;
    var originalText = btn.textContent;
    
    navigator.clipboard.writeText(vpnLink).then(function() {
        notification.classList.add('show');
        btn.textContent = '✓ Скопировано!';
        btn.style.color = '#050505';
        btn.style.background = '#39FF14';
        
        setTimeout(function() {
            notification.classList.remove('show');
            btn.textContent = originalText;
            btn.style.color = '#39FF14';
            btn.style.background = 'rgba(57, 255, 20, 0.08)';
        }, 2000);
    }).catch(function() {
        var textarea = document.createElement('textarea');
        textarea.value = vpnLink;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            notification.classList.add('show');
            btn.textContent = '✓ Скопировано!';
            btn.style.color = '#050505';
            btn.style.background = '#39FF14';
            
            setTimeout(function() {
                notification.classList.remove('show');
                btn.textContent = originalText;
                btn.style.color = '#39FF14';
                btn.style.background = 'rgba(57, 255, 20, 0.08)';
            }, 2000);
        } catch (err) {
            alert('Не удалось скопировать. Скопируйте ссылку вручную.');
        }
        document.body.removeChild(textarea);
    });
});

// ========== REVEAL ON SCROLL ==========
function revealOnScroll() {
    var reveals = document.querySelectorAll('.reveal');
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('visible');
        }
    }
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ========== PARALLAX HERO ==========
function parallaxHero() {
    var heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;
    var scrolled = window.pageYOffset;
    heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
    heroBg.style.opacity = 1 - scrolled / 800;
}

window.addEventListener('scroll', parallaxHero);

// ========== NAVBAR ==========
function navbarEffect() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(5, 5, 5, 0.8)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.45)';
    }
}

window.addEventListener('scroll', navbarEffect);

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== PAGE LOAD ==========
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(function() {
        document.body.style.opacity = '1';
    });
});

console.log('%c[ KUERTOV PROJECT ] %cLOADED',
    'color: #39FF14; font-weight: bold; text-shadow: 0 0 10px rgba(57,255,20,0.6);',
    'color: #fff;');
console.log('%c>> Свобода информации — наше общее дело',
    'color: #FF00FF; text-shadow: 0 0 6px rgba(255,0,255,0.5);');

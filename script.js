// Navbar scroll effect
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Intersection Observer for scroll reveal animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, index * 100);
    }
  });
}, observerOptions);

// Observe all cards
document.querySelectorAll(".reveal").forEach((card) => {
  observer.observe(card);
});

// Create floating particles
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const delay = Math.random() * 20;
    const duration = 15 + Math.random() * 15;

    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;

    particlesContainer.appendChild(particle);
  }
}

// Initialize particles
createParticles();

// Add ripple effect to CTA button
const ctaButton = document.querySelector(".cta-button");

ctaButton.addEventListener("click", function (e) {
  const rect = this.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.style.position = "absolute";
  ripple.style.width = "20px";
  ripple.style.height = "20px";
  ripple.style.background = "rgba(255, 255, 255, 0.5)";
  ripple.style.borderRadius = "50%";
  ripple.style.left = `${e.clientX - rect.left}px`;
  ripple.style.top = `${e.clientY - rect.top}px`;
  ripple.style.transform = "translate(-50%, -50%)";
  ripple.style.pointerEvents = "none";
  ripple.style.animation = "ripple 0.6s ease-out";

  this.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
});

// Add CSS animation for ripple
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        from {
            width: 20px;
            height: 20px;
            opacity: 1;
        }
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const heroGlow = document.querySelector(".hero-glow");

  if (heroGlow && scrollY < window.innerHeight) {
    const speed = 0.5;
    heroGlow.style.transform = `translate(-50%, -50%) translateY(${scrollY * speed}px)`;
  }
});

// Add hover effect tracking for cards
const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  const cardGlow = card.querySelector(".card-glow");

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    cardGlow.style.transform = `translate(${deltaX * 20}px, ${deltaY * 20}px)`;

    // Update CSS custom properties for gradient effect
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${percentX}%`);
    card.style.setProperty("--mouse-y", `${percentY}%`);
  });

  card.addEventListener("mouseleave", () => {
    cardGlow.style.transform = "translate(0, 0)";
  });
});

// Loading animation on page load
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// Daily Planner Functionality
class DailyPlanner {
  constructor() {
    this.tasks = this.loadTasks();
    this.taskInput = document.getElementById("taskInput");
    this.addTaskBtn = document.getElementById("addTaskBtn");
    this.tasksContainer = document.getElementById("tasksContainer");
    this.clearAllBtn = document.getElementById("clearAllBtn");
    this.emptyState = document.getElementById("emptyState");

    this.init();
  }

  init() {
    this.renderTasks();
    this.updateStats();
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.addTaskBtn.addEventListener("click", () => this.addTask());
    this.taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addTask();
    });
    this.clearAllBtn.addEventListener("click", () => this.clearAllTasks());
  }

  loadTasks() {
    const savedTasks = localStorage.getItem("dailyPlannerTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  }

  saveTasks() {
    localStorage.setItem("dailyPlannerTasks", JSON.stringify(this.tasks));
  }

  addTask() {
    const taskText = this.taskInput.value.trim();
    if (!taskText) return;

    const task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.tasks.unshift(task);
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
    this.taskInput.value = "";

    // Add success animation
    this.taskInput.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.taskInput.style.transform = "scale(1)";
    }, 100);
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
  }

  toggleTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.renderTasks();
      this.updateStats();
    }
  }

  clearAllTasks() {
    if (this.tasks.length === 0) return;

    if (confirm("Are you sure you want to clear all tasks?")) {
      this.tasks = [];
      this.saveTasks();
      this.renderTasks();
      this.updateStats();
    }
  }

  formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  renderTasks() {
    if (this.tasks.length === 0) {
      this.emptyState.style.display = "flex";
      this.clearAllBtn.classList.add("hidden");
      return;
    }

    this.emptyState.style.display = "none";
    this.clearAllBtn.classList.remove("hidden");

    this.tasksContainer.innerHTML = this.tasks
      .map(
        (task) => `
            <div class="task-item ${task.completed ? "completed" : ""}" data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? "checked" : ""}" onclick="planner.toggleTask(${task.id})"></div>
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <span class="task-time">${this.formatTime(task.createdAt)}</span>
                <button class="task-delete" onclick="planner.deleteTask(${task.id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `,
      )
      .join("");
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize planner when DOM is ready
let planner;
if (document.getElementById("taskInput")) {
  planner = new DailyPlanner();
}

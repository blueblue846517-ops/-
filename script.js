document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const animateElements = document.querySelectorAll('.service-card, .ref-item, .mc-item');
    
    // Set initial state
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a small stagger effect based on index if multiple items appear at once
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, (index % 4) * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Slider Logic
    const initSlider = (sliderId, prevBtnId, nextBtnId, itemClass) => {
        const sliderTrack = document.getElementById(sliderId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        
        if (sliderTrack && prevBtn && nextBtn) {
            let currentPosition = 0;
            
            const updateSlider = () => {
                const items = document.querySelectorAll(itemClass);
                if (items.length === 0) return;
                
                const itemWidth = items[0].getBoundingClientRect().width;
                const gap = 20; // from CSS gap: 20px
                const totalWidth = itemWidth + gap;
                const trackWidth = items.length * totalWidth - gap;
                
                // .slider-track-wrap is the parent of sliderTrack
                const containerWidth = sliderTrack.parentElement.getBoundingClientRect().width;
                
                // maxTranslate is the maximum we can move to the left
                const maxTranslate = Math.max(0, trackWidth - containerWidth);
                
                // current translation
                let translate = currentPosition * totalWidth;
                if (translate > maxTranslate) {
                    translate = maxTranslate;
                }
                
                sliderTrack.style.transform = `translateX(-${translate}px)`;
            };

            const getMaxPosition = () => {
                const items = document.querySelectorAll(itemClass);
                if (items.length === 0) return 0;
                const itemWidth = items[0].getBoundingClientRect().width;
                const gap = 20;
                const totalWidth = itemWidth + gap;
                const trackWidth = items.length * totalWidth - gap;
                const containerWidth = sliderTrack.parentElement.getBoundingClientRect().width;
                
                if (trackWidth <= containerWidth) return 0;
                return Math.ceil((trackWidth - containerWidth) / totalWidth);
            };

            nextBtn.addEventListener('click', () => {
                const maxPosition = getMaxPosition();
                if (currentPosition < maxPosition) {
                    currentPosition++;
                    updateSlider();
                }
            });

            prevBtn.addEventListener('click', () => {
                if (currentPosition > 0) {
                    currentPosition--;
                    updateSlider();
                }
            });
            
            // Handle window resize for slider
            window.addEventListener('resize', () => {
                const maxPosition = getMaxPosition();
                if (currentPosition > maxPosition) {
                    currentPosition = maxPosition;
                }
                updateSlider();
            });
        }
    };

    initSlider('referenceSlider', 'ref-prev', 'ref-next', '#referenceSlider .ref-item');
    initSlider('mcSlider', 'mc-prev', 'mc-next', '#mcSlider .mc-item');

    // Modal Logic
    const termsModal = document.getElementById('termsModal');
    const openTermsBtn = document.getElementById('openTerms');
    const closeTermsBtn = document.getElementById('closeTerms');

    if (termsModal && openTermsBtn && closeTermsBtn) {
        openTermsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.style.display = 'flex';
        });

        closeTermsBtn.addEventListener('click', () => {
            termsModal.style.display = 'none';
        });

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === termsModal) {
                termsModal.style.display = 'none';
            }
            if (e.target === privacyModal) {
                privacyModal.style.display = 'none';
            }
        });
    }

    const privacyModal = document.getElementById('privacyModal');
    const openPrivacyBtn = document.getElementById('openPrivacy');
    const closePrivacyBtn = document.getElementById('closePrivacy');

    if (privacyModal && openPrivacyBtn && closePrivacyBtn) {
        openPrivacyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.style.display = 'flex';
        });

        closePrivacyBtn.addEventListener('click', () => {
            privacyModal.style.display = 'none';
        });
    }

    // Contact form submission via Google Apps Script
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // 페이지 새로고침 방지

            // Vercel에서 구글 서버(API)로 데이터를 보낼 주소
            // 앱스 스크립트 배포 후 얻은 '웹 앱 URL'을 이곳에 꼭 붙여넣으세요!
            const scriptUrl = "여기에_앱스크립트_배포_URL_입력"; 

            // 사용자가 입력한 값 가져오기 (input 태그의 id 값과 매칭)
            const formData = {
                company: document.getElementById("companyName").value,
                name: document.getElementById("contactName").value,
                phone: document.getElementById("contactPhone").value,
                budget: document.getElementById("budget").value,
                details: document.getElementById("eventScale").value
            };

            try {
                // Vercel ➡️ 구글 앱스 스크립트로 데이터 전송
                // * 꿀팁: CORS 보안 에러를 피하기 위해 Content-Type을 반드시 text/plain으로 설정합니다.
                const response = await fetch(scriptUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.status === "success") {
                    alert("문의가 성공적으로 접수되었습니다. 담당자가 빠르게 연락드리겠습니다!");
                    // 폼 입력창 초기화
                    contactForm.reset(); 
                } else {
                    alert("접수 중 일시적인 오류가 발생했습니다.");
                }
            } catch (error) {
                console.error("전송 에러:", error);
                alert("서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.");
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    function switchSection(targetId) {
        // Hide all sections first
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(targetId);
        targetSection.style.display = 'block';

        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + targetId) {
                link.classList.add('active');
            }
        });
    }

    // Event listener for navigation links
    document.querySelectorAll('.nav-link, .cta-button').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            switchSection(targetId);

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // Show home section by default
    document.getElementById('home').style.display = 'block';
});
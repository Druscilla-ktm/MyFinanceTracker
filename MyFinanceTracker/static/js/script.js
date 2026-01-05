document.addEventListener('DOMContentLoaded', function() {
    // Add zebra striping to transaction rows
    const rows = document.querySelectorAll('.transaction-row');
    rows.forEach((row, index) => {
        if (index % 2 === 0) {
            row.style.backgroundColor = '#f9f9f9';
        } else {
            row.style.backgroundColor = '#ffffff';
        }
    });

    // Highlight row on hover
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#e0f7fa';
        });
        row.addEventListener('mouseleave', (e) => {
            const index = Array.from(rows).indexOf(row);
            row.style.backgroundColor = (index % 2 === 0) ? '#f9f9f9' : '#ffffff';
        });
    });
});
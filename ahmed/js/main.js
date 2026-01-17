$(document).ready(function () {

    // بيانات أولية للمشروع (Array of Objects)
    const aidData = [
        { id: 1, type: "غذاء", location: "حي الرمال", date: "2024-10-25 10:00 AM", status: "متاح", description: "توزيع سلات غذائية تحتوي على معلبات وطحين." },
        { id: 2, type: "دواء", location: "خان يونس", date: "2024-10-26 09:00 AM", status: "مكتمل", description: "توزيع أدوية الأمراض المزمنة في المركز الصحي." },
        { id: 3, type: "مياه", location: "جباليا", date: "2024-10-25 12:00 PM", status: "متاح", description: "تعبئة مياه صالحة للشرب بجوار المسجد الكبير." },
        { id: 4, type: "إيواء", location: "دير البلح", date: "2024-10-27 08:30 AM", status: "متاح", description: "توزيع خيام وبطانيات للعائلات النازحة." },
        { id: 5, type: "غذاء", location: "رفح", date: "2024-10-28 11:00 AM", status: "قيد التجهيز", description: "وجبات ساخنة للأطفال." },
        { id: 6, type: "مياه", location: "حي الزيتون", date: "2024-10-25 02:00 PM", status: "مكتمل", description: "صهاريج مياه متنقلة." }
    ];

    // دالة لعرض الجدول (Function to render table)
    function renderTable(data) {
        const tbody = $('#tableBody');
        tbody.empty(); // تفريغ الجدول القديم

        if (data.length === 0) {
            tbody.append('<tr><td colspan="5" class="text-danger">لا توجد بيانات...</td></tr>');
            return;
        }

        data.forEach(item => {
            // تغيير لون الحالة
            let badgeClass = 'bg-secondary';
            if (item.status === 'متاح') badgeClass = 'bg-success';
            if (item.status === 'مكتمل') badgeClass = 'bg-danger';
            if (item.status === 'قيد التجهيز') badgeClass = 'bg-warning text-dark';

            const row = `
                <tr class="aid-row" data-bs-toggle="modal" data-bs-target="#detailsModal" data-id="${item.id}">
                    <td>${item.type}</td>
                    <td>${item.location}</td>
                    <td>${item.date}</td>
                    <td><span class="badge ${badgeClass}">${item.status}</span></td>
                    <td><button class="btn btn-sm btn-outline-primary"><i class="fa fa-eye"></i></button></td>
                </tr>
            `;
            tbody.append(row);
        });

        // تأثير اختفاء وظهور بسيط
        $('.aid-row').hide().fadeIn(500);
    }

    // استدعاء الدالة أول مرة
    renderTable(aidData);

    // البحث والفلترة عند الكتابة
    $('#searchInput').on('keyup', function () {
        const value = $(this).val().toLowerCase();
        filterData(value, $('#filterType').val());
    });

    // الفلترة عند تغيير القائمة
    $('#filterType').on('change', function () {
        const type = $(this).val();
        filterData($('#searchInput').val().toLowerCase(), type);
    });

    // دالة الفلترة الرئيسية
    function filterData(searchValue, typeValue) {
        const filtered = aidData.filter(item => {
            const matchesSearch = item.location.includes(searchValue) || item.type.includes(searchValue);
            const matchesType = typeValue === 'all' || item.type === typeValue;
            return matchesSearch && matchesType;
        });
        renderTable(filtered);
    }

    // عرض التفاصيل في النافذة المنبثقة (Modal)
    $(document).on('click', '.aid-row', function () {
        const id = $(this).data('id');
        const item = aidData.find(d => d.id === id);

        if (item) {
            $('#modalContent').html(`
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>النوع:</strong> ${item.type}</li>
                    <li class="list-group-item"><strong>الموقع:</strong> ${item.location}</li>
                    <li class="list-group-item"><strong>التاريخ:</strong> ${item.date}</li>
                    <li class="list-group-item"><strong>الحالة:</strong> ${item.status}</li>
                    <li class="list-group-item"><strong>التفاصيل:</strong> ${item.description}</li>
                </ul>
            `);
        }
    });

    // التحقق من النموذج وإرساله (Form Validation)
    $('#aidForm').on('submit', function (e) {
        e.preventDefault();

        const name = $('#name').val().trim();
        const aidType = $('#aidType').val();
        const message = $('#message').val().trim();
        const feedback = $('#formFeedback');

        // التحقق من الحقول
        if (name === "" || aidType === null || message === "") {
            feedback.removeClass('d-none text-success').addClass('text-danger').text("تأكد من تعبئة الحقول المطلوبة!");
            return;
        }

        // محاكاة زر الإرسال
        const submitBtn = $(this).find('button[type="submit"]');
        submitBtn.prop('disabled', true).text('جاري الإرسال...');

        setTimeout(() => {
            // محاكاة نجاح العملية
            feedback.removeClass('d-none text-danger').addClass('text-success').text(`شكراً ${name}، وصلنا طلبك بخصوص (${aidType}).`);
            $('#aidForm')[0].reset();
            submitBtn.prop('disabled', false).text('إرسال الطلب');
        }, 1500);
    });

    // تغيير كلاس القائمة عند التمرير (Active Link)
    $(window).on('scroll', function () {
        let scrollPos = $(window).scrollTop();
        $('.nav-link').each(function () {
            let currLink = $(this);
            let refElement = $(currLink.attr("href"));
            if (refElement.length && refElement.position().top - 100 <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.nav-link').removeClass("active");
                currLink.addClass("active");
            }
        });
    });

    // --- Dark Mode Logic ---
    const toggleBtn = $('#darkModeToggle');
    const body = $('body');
    const icon = toggleBtn.find('i');

    // Check LocalStorage on load
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.addClass('dark-mode');
        icon.removeClass('fa-moon').addClass('fa-sun');
    }

    toggleBtn.on('click', function () {
        body.toggleClass('dark-mode');
        if (body.hasClass('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            icon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            localStorage.setItem('darkMode', 'disabled');
            icon.removeClass('fa-sun').addClass('fa-moon');
        }
    });

});

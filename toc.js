Main();

function Main() {
    if (!IsArticle()) {
        return;
    }

    const main = document.querySelector('#main');
    main.style.display = "flex";

    const tocWrapper = CreateTocWrapper();
    const tocContainer = CreateTocContainer();
    tocWrapper.append(tocContainer);

    const innerIndex = document.querySelector('.tt_article_useless_p_margin');
    const tocTarget = innerIndex.querySelectorAll('h1, h2, h3, h4, h5, h6');

    let content = ""
    let prevFocusTocElement;

    for (const each of tocTarget) {
        each.id = each.textContent;
        const content = document.createElement('span');
        content.innerHTML = AddTabIntoText(each.tagName, each.textContent);
        content.id = `${each.id}-toc`;
        content.setAttribute('href', `#${each.id}`);
        content.style.cssText = `
                color: black;
                cursor: pointer;
            `;

        content.addEventListener('mouseover', (e) => {
            if (prevFocusTocElement) {
                BlurToc(prevFocusTocElement);
            }

            prevFocusTocElement = e.target;
            FocusToc(e.target);
        });

        content.addEventListener('mouseover', (e) => {
            if (prevFocusTocElement) {
                BlurToc(prevFocusTocElement);
            }

            prevFocusTocElement = e.target;
            FocusToc(e.target);
        });

        content.addEventListener('mouseout', (e) => {
            if (prevFocusTocElement) {
                BlurToc(prevFocusTocElement);
            }

            prevFocusTocElement = e.target;
            BlurToc(e.target);
        });


        tocContainer.append(content);
        const br = document.createElement('br');
        tocContainer.append(br);
    }

    main.append(tocWrapper);

    const RefreshToc = () => {
        let topElement;
        let topY = 99999;
        for (const each of tocTarget) {
            const rect = each.getBoundingClientRect();
            const offsetY = Math.abs(rect.y);
            if (topY > offsetY) {
                topY = offsetY;
                topElement = each;
            }

            const tocId = `#${each.id}-toc`;
            const tocElement = document.querySelector(tocId);
            BlurToc(tocElement);
        }

        const tocId = `#${topElement.id}-toc`;
        const tocElement = document.querySelector(tocId);
        FocusToc(tocElement);
    };

    document.addEventListener('scroll', (e) => {
        RefreshToc();
    });
}

function FocusToc(e) {
    if ((e?.id.includes('toc')){
        return;
    }

    e.style.fontWeight = "bold";
}

function BlurToc(e) {
    if (e?.id.includes('toc')) {
        return;
    }

    e.style.fontWeight = "normal";
    e.style.borderLeft = "";
}

function CreateTocWrapper() {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
            border-left: 1px solid #ddd;
        `;

    return wrapper;
}

function CreateTocContainer() {
    const tocContainer = document.createElement('div');
    tocContainer.style.cssText = `
            min-width: 100px;
            border-left: 1px solid #ddd;
            position: sticky;
            top: 0px;
            align-self: flex-start;
        `;

    tocContainer.addEventListener('click', (e) => {
        document.querySelector(e.target.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });

    return tocContainer;
}

function IsArticle() {
    const currentUrl = window.location.href;
    const parsedUrl = currentUrl.split("/");
    const ret = parseInt(parsedUrl[parsedUrl.length - 1], 10);

    return typeof ret === 'number' && isFinite(ret);
}

function AddTabIntoText(tag, text) {
    let length = 1;
    compTag = tag.toLowerCase();
    if (compTag === 'h2') {
        length = 1;
    } else if (compTag === 'h3') {
        length = 2;
    } else if (compTag === 'h4') {
        length = 3;
    } else if (compTag === 'h5') {
        lenght = 4;
    } else if (compTag === 'h6') {
        length = 5;
    } else {
        length = 1;
    }

    let tab = "";
    for (let i = 0; i < length; i++) {
        tab += "&emsp;"
    }

    return `${tab}${text}`;
}
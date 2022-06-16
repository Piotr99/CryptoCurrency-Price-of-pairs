const inputs = document.querySelectorAll('input');
    const URL = `https://api3.binance.com/api/v3/ticker/price?symbol=`
    const currency = {
        firstCoin,
        secondCoin
    }

    let div;
    let time;
    let checkInterval;
    let { firstCoin, secondCoin } = currency

    const refresh = (init, isPaused) => {
        if (!isPaused) {
            clearInterval(time)
        } else {

            time = setInterval(init, 1000)
        }
    }
    const reset = () => {
        firstCoin = "";
        secondCoin = "";
        inputs[0].value = ""
        inputs[1].value = ""

    }

    const render = (data, firstCoin, secondCoin) => {
        div = document.createElement('div');
        div.className = 'container container-fluid bg-dark text-white py-3 my-1 d-flex justify-content-evenly'
        div.style.cursor = "pointer";
        div.classList.add('item');
        div.innerHTML = `
        <span>${firstCoin} / ${secondCoin}</span>
        <span>${Number(data.price).toFixed(4)}$</span>
        `;
        document.body.appendChild(div)
    }

    const init = async (firstCoin, secondCoin) => {
        const res = await fetch(URL + (firstCoin ? firstCoin : "BTC") + (secondCoin ? secondCoin : "USDT"));
        const response = res.json()
        response.then(data => {
            render(data, firstCoin, secondCoin)
            checkInterval = (isPaused) => {
                return refresh(() => init(firstCoin, secondCoin), isPaused)
            }
            div.addEventListener('click', () => {
                checkInterval(true)
            })
        })
    }

    inputs.forEach(input => {
        input.addEventListener('blur', e => {
            e.preventDefault()
            if (inputs[0].value && inputs[1].value) {
                firstCoin = (inputs[0].value.toUpperCase()).trim();
                secondCoin = (inputs[1].value.toUpperCase()).trim();
                init(firstCoin, secondCoin);
                reset()
            } else {

                return
            }
        }
        )
    })

    window.addEventListener('keydown', (e) => {
        let elements = document.querySelectorAll('.item');
        if (e.code == "Backspace") {
            elements.forEach(element => element.remove())
            location.reload()
        } else if (e.code == "Space") {
            checkInterval(false)
        }
    })

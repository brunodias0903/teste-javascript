(function (DOM, doc) {
  'use strict'

  var numbersSelectedLength = 0
  var numbersSelected = []
  var actualPrice = 0

  var rules
  var actualGame

  var app = () => {
    return {
      init: function init() {
        this.openConnection()
      },

      openConnection: function openConnection() {
        var ajax = new XMLHttpRequest()
        ajax.open('GET', './games.json', true)
        ajax.send()
        ajax.addEventListener('readystatechange', this.getBetData, false)
      },

      getBetData: function getBetData() {
        rules = JSON.parse(this.responseText).types
        if (this.readyState === 4) app().initButtons()
      },

      initButtons: function initButtons() {
        actualGame = rules[0]
        rules.map(app().createButtonGame)
        app().showBetInfo()
      },

      initButtonsEvents: function initButtonsEvents() {
        DOM('.complete-game').on('click', this.handleCompleteGame, false)
        DOM('.clear-game').on('click', this.handleClickClearGame, false)
        DOM('.cart-button').on('click', this.handleClickCart, false)
      },

      initNumbersEvents: function initNumbersEvents() {
        DOM('.number-card').on('click', this.handleClickBetNumber, false)
      },

      handleClickBetButton: function handleClickBetButton(game, $button) {
        numbersSelected = []
        actualGame = game

        app().changeBackgroundColor($button)
        app().showBetInfo()
      },

      handleClickBetNumber: function handleClickBetNumber() {
        if (app().hasNumber(this.textContent)) {
          this.className = 'number-card'
          numbersSelected.splice(numbersSelected.indexOf(Number(this.textContent)), 1)
        } else if (numbersSelected.length === numbersSelectedLength) {
          alert('Jogo cheio')
        } else {
          this.className = 'number-card-actived'
          numbersSelected.push(Number(this.textContent))
        }
      },

      handleCompleteGame: function handleCompleteGame() {
        var numOfEmptySpaces = numbersSelectedLength - numbersSelected.length
        for (var i = 0; i < numOfEmptySpaces; i++) {
          numbersSelected.push(app().getRandomIntInclusive(actualGame.range))
        }
        app().changeNumbersBackgroundColor()
      },

      handleClickClearGame: function handleClickBetNumber() {
        var $numbers = new DOM('.number-card-actived').get()
        for (var elem of $numbers) {
          elem.className = 'number-card'
        }
        numbersSelected = []
      },

      handleClickCart: function handleClickCart() {
        app().addToCart()
      },

      getGameRules: function getGameRules(text) {
        var result = rules.filter((obj) => {
          return obj.type === text
        })
        return result[0]
      },

      changeBackgroundColor: function changeBackgroundColor($button) {
        var $buttons = DOM('.game-button').get()
        for (var elem of $buttons) {
          elem.style.backgroundColor = '#FFF'
          elem.style.color = elem.style.borderColor
        }
        $button.style.backgroundColor = actualGame.color
        $button.style.color = '#FFF'
      },

      changeNumbersBackgroundColor: function changeNumbersBackgroundColor() {
        var $numbers = new DOM('.number-card').get()
        for (var elem of $numbers) {
          for (var value of numbersSelected) {
            if (Number(elem.textContent) === value) elem.className = 'number-card-actived'
          }
        }
      },

      showBetInfo: function showBetInfo() {
        var { ['max-number']: maxNumber } = actualGame
        numbersSelectedLength = maxNumber

        var $titleContainer = doc.getElementsByClassName('title')[0]
        var $titleGameOld = doc.getElementsByClassName('game-name')[0]

        var $rulesContainer = doc.getElementsByClassName('rules')[0]
        var $oldParagraph = doc.getElementsByClassName('paragraph')[0]

        var $bettingSheetContent = doc.getElementsByClassName('betting-sheet')[0]
        var $oldCard = doc.getElementsByClassName('card')[0]
        var $card = doc.createElement('div')

        var $buttonContainer = doc.getElementsByClassName('button-container')[0]
        var $cartButton = doc.createElement('button')
        var $cartButtonText = doc.createTextNode('Add to cart')
        var $img = doc.createElement('img')

        $cartButton.className = 'cart-button'
        $img.src = 'img/icons/shopping-cart.svg'

        $cartButton.appendChild($img)
        $cartButton.appendChild($cartButtonText)

        $card.className = 'card'

        for (var i = 1; i <= actualGame.range; i++) {
          $card.appendChild(app().createCardNumber(i))
        }

        if ($titleGameOld) {
          $titleContainer.replaceChild(this.createtitleContainer(actualGame.type), $titleGameOld,)
          $rulesContainer.replaceChild(this.createRulesParagraph(actualGame.description), $oldParagraph,)
          $bettingSheetContent.replaceChild($card, $oldCard)

          app().initNumbersEvents()
        } else {
          $titleContainer.appendChild(this.createtitleContainer(actualGame.type))
          $rulesContainer.appendChild(this.createRulesTitle())
          $rulesContainer.appendChild(this.createRulesParagraph(actualGame.description))
          $bettingSheetContent.replaceChild($card, $oldCard)
          $buttonContainer.appendChild(this.createButtonContainer())
          $buttonContainer.appendChild($cartButton)

          app().initNumbersEvents()
          app().initButtonsEvents()
        }
      },

      createButtonGame: function createButtonGame(game) {
        var $option = doc.getElementsByClassName('option')[0]
        var $button = doc.createElement('button')
        $button.className = 'game-button'
        $button.textContent = game.type
        $button.style.color = game.color
        $button.style.borderColor = game.color
        $button.textContent = game.type

        if (game.type === 'Lotofácil') {
          $button.style.color = '#FFF'
          $button.style.background = game.color
        }

        $button.addEventListener('click', () => app().handleClickBetButton(game, $button))
        $option.appendChild($button)
      },

      createtitleContainer: function createtitleContainer() {
        var $titleGameName = doc.createElement('h1')
        $titleGameName.className = 'game-name'
        $titleGameName.textContent = `FOR ${arguments[0]}`

        return $titleGameName
      },

      createRulesTitle: function createRulesTitle() {
        var $ruleTitle = doc.createElement('h1')
        $ruleTitle.textContent = 'Fill your bet'
        return $ruleTitle
      },

      createRulesParagraph: function createRulesParagraph() {
        var $paragraph = doc.createElement('p')
        $paragraph.className = 'paragraph'
        $paragraph.textContent = arguments[0]
        return $paragraph
      },

      createCardNumber: function createCardNumber(number) {
        var $numberCard = doc.createElement('button')
        $numberCard.className = 'number-card'
        $numberCard.textContent = number

        return $numberCard
      },

      createButtonContainer: function createButtonContainer() {
        var $div = doc.createElement('div')
        var $completeGame = doc.createElement('button')
        var $clearGame = doc.createElement('button')

        $completeGame.className = 'complete-game'
        $completeGame.textContent = 'Complete game'
        $clearGame.className = 'clear-game'
        $clearGame.textContent = 'Clear game'

        $div.appendChild($completeGame)
        $div.appendChild($clearGame)

        return $div
      },

      hasNumber: function hasNumber() {
        return numbersSelected.some((num) => num === Number(arguments[0]))
      },

      getRandomIntInclusive: function getRandomIntInclusive(max) {
        var num = Math.ceil(Math.random() * max)
        while (numbersSelected.indexOf(num) >= 0) {
          num = Math.ceil(Math.random() * max)
        }
        return num
      },

      compare: function compare(num1, num2) {
        if (num1 > num2) return 1
        if (num1 < num2) return -1
        return 0
      },

      addToCart: function addToCart() {
        numbersSelected.sort(app().compare)
        if (!app().isComplete()) {
          alert('Carrinho precisa estar cheio')
          return
        }

        var $card = doc.getElementsByClassName('cart-betting-sheet')[0]
        var $price = doc.getElementsByClassName('total-price-p')[0]
        var $bet = doc.createElement('div')

        $bet.className = 'betting-sheet-game'
        $bet.appendChild(app().createTrahsButton())
        $bet.appendChild(app().createBetContaianer())

        $price.textContent = `TOTAL: ${app().currencyFormate(actualPrice)}`
        $card.appendChild($bet)
        numbersSelected = []
        app().handleClickClearGame()
      },

      createTrahsButton: function createTrahsButton() {
        var $delete = doc.createElement('button')
        var $trashImg = doc.createElement('img')

        $delete.className = 'delete-bet'
        $delete.id = actualGame.price
        $trashImg.src = 'img/icons/trash.svg'
        $trashImg.alt = 'deletar'

        $delete.appendChild($trashImg)
        $delete.addEventListener('click', app().removeBet)

        return $delete
      },

      createBetContaianer: function createBetContaianer() {
        var $bet = doc.createElement('div')
        var $bar = doc.createElement('div')

        var $betCard = doc.createElement('div')
        var $numbers = doc.createElement('p')

        var $betPrice = doc.createElement('div')
        var $gameName = doc.createElement('p')
        var $price = doc.createElement('p')

        $bet.className = 'bet'
        $betCard.className = 'bet-card'

        $numbers.className = 'numbers'
        $numbers.textContent = numbersSelected.join(', ')
        $betPrice.className = 'bet-price'

        $price.className = 'price'

        $bar.className = 'bar'
        $bar.style.background = actualGame.color
        $gameName.className = 'name'
        $gameName.style.color = actualGame.color
        $gameName.textContent = actualGame.type
        $price.textContent += app().currencyFormate(actualGame.price)
        actualPrice += actualGame.price

        $betPrice.appendChild($gameName)
        $betPrice.appendChild($price)
        $betCard.appendChild($numbers)
        $betCard.appendChild($betPrice)
        $bet.appendChild($bar)
        $bet.appendChild($betCard)

        return $bet
      },

      isComplete: function isComplete() {
        return numbersSelected.length === numbersSelectedLength
      },

      removeBet: function removeBet() {
        var $price = doc.getElementsByClassName('total-price-p')[0]
        actualPrice -= this.id
        $price.textContent = `TOTAL: R$ ${actualPrice}`
        this.parentNode.parentNode.removeChild(this.parentNode)
      },

      currencyFormate: function currencyFormate(price) {
        return price.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        })
      },
    }
  }

  app().init();
})(window.DOM, document);
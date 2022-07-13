// ****** select items **********
const form = document.querySelector('.grocery')
const alert = document.querySelector('.alert')
const input = document.querySelector('.input')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editElement
let editFlag = false
let editID = ''

// ****** event listeners **********
form.addEventListener('submit', addItem)
// clear list
clearBtn.addEventListener('click', clearList)
// setup items onload
window.addEventListener('DOMContentLoaded', setupItems)

// ****** functions **********
function addItem(e) {
  e.preventDefault()
  const value = input.value
  const id = new Date().getTime().toString()

  if (value !== "" && !editFlag) {
    const articleEl = document.createElement('article')
    const attr = document.createAttribute('data-id')
    attr.value = id
    articleEl.setAttributeNode(attr)
    articleEl.classList.add('grocery-item')
    articleEl.innerHTML = `
                <p>${value}</p>
            <div class="action-container">
              <button class="edit-btn">
                <span class="iconify" data-icon="bxs:edit"></span>
              </button>
              <button class="delete-btn">
                <span
                  class="iconify"
                  data-icon="fluent:delete-24-regular"
                ></span>
              </button>
            </div>
    `
    // add event listeners to both buttons
    const editBtn = articleEl.querySelector('.edit-btn')
    editBtn.addEventListener('click', editItem)
    const deleteBtn = articleEl.querySelector('.delete-btn')
    deleteBtn.addEventListener('click', deleteItem)

    list.appendChild(articleEl)

    // show grocery container
    container.classList.add('show-container')
    addToLocalStorage(id, value)
    setBackToDefault()
    displayAlert('Item added successfully!', 'success')
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value
    displayAlert('Item edited successfully!', 'success')

    // edit local storage
    editLocalStorage(editID, value)
    setBackToDefault()
  } else {
    displayAlert('Please enter an item', 'danger')
  }
}

// display alert func
function displayAlert(msg, action) {
  alert.textContent = msg
  alert.classList.add(`alert-${action}`)

  // remove alert
  setTimeout(function () {
    alert.textContent = ''
    alert.classList.remove(`alert-${action}`)
  }, 2000)
}

// clear list
function clearList() {
  const items = document.querySelectorAll('.grocery-item')

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item)
    })
  }

  container.classList.remove('show-container')
  displayAlert("List cleared successfully!", 'success')
  setBackToDefault()
  localStorage.removeItem('list')
}
// delete item func
function deleteItem(e) {
  const articleEl = e.currentTarget.parentElement.parentElement
  const id = articleEl.dataset.id

  list.removeChild(articleEl)
  if (list.children.length === 0) {
    container.classList.remove('show-container')
  }
  displayAlert('Item deleted successfully!', 'success')
  setBackToDefault()
  removeFromLocalStorage(id)
}
// edit item func
function editItem(e) {
  const articleEl = e.currentTarget.parentElement.parentElement
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling
  // set input value
  input.value = editElement.innerHTML
  editFlag = true
  editID = articleEl.dataset.id
  submitBtn.textContent = 'edit'
}
// set back to defaults
function setBackToDefault() {
  input.value = ''
  editFlag = false
  editID = ''
  submitBtn.textContent = 'Submit'
}
// ***** local storage ****

// add to local storage
function addToLocalStorage(id, value) {
  const grocery = { id, value }
  let items = getLocalStorage()
  items.push(grocery)
  localStorage.setItem('list', JSON.stringify(items))
}
function getLocalStorage() {
  return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage()

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(items))
}
function editLocalStorage(id, value) {
  let items = getLocalStorage()

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value
    }
    return item
  })
  localStorage.setItem('list', JSON.stringify(items))
}
// *** setup items ***
function setupItems() {
  let items = getLocalStorage()

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value)
    })
    container.classList.add('show-container')
  }
}

function createListItem(id, value) {
  const articleEl = document.createElement('article')
  const attr = document.createAttribute('data-id')
  attr.value = id
  articleEl.setAttributeNode(attr)
  articleEl.classList.add('grocery-item')
  articleEl.innerHTML = `
                <p>${value}</p>
            <div class="action-container">
              <button class="edit-btn">
                <span class="iconify" data-icon="bxs:edit"></span>
              </button>
              <button class="delete-btn">
                <span
                  class="iconify"
                  data-icon="fluent:delete-24-regular"
                ></span>
              </button>
            </div>
    `
  // add event listeners to both buttons
  const editBtn = articleEl.querySelector('.edit-btn')
  editBtn.addEventListener('click', editItem)
  const deleteBtn = articleEl.querySelector('.delete-btn')
  deleteBtn.addEventListener('click', deleteItem)

  list.appendChild(articleEl)
}
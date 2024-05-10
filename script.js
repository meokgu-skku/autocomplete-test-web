document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('searchInput');
  var resultsContainer = document.getElementById('autocompleteResults');

  searchInput.addEventListener('input', function() {
    var query = this.value;
    fetchAutocompleteResults(query);
  });

  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchRestaurants(this.value);  // Function call to search restaurants using Elasticsearch
    }
  });

  function fetchAutocompleteResults(query) {
    fetch(`http://localhost:8090/restaurant?query=${query}`)
    .then(response => response.json())
    .then(data => displayResults(data.results))
    .catch(error => console.error('Error:', error));
  }

  function displayResults(results) {
    resultsContainer.innerHTML = '';
    results.forEach(function(item) {
      var div = document.createElement('div');
      div.className = 'autocomplete-entry'; // Added class for styling
      div.innerHTML = `${item.highlighted_display} <span class="category">${item.category}</span>`; // Display category
      resultsContainer.appendChild(div);
    });
  }

  function searchRestaurants(query) {
    fetch(`http://localhost:9200/restaurant/_search`, {  // Assuming Elasticsearch is on localhost port 9200
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
          bool: {
            should: [
              { match: { category: query }},
              { match: { name: query }},
              { match: { custom_category: query }},
              {
                nested: {
                  path: "menus",
                  query: {
                    bool: {
                      should: [
                        { match: { "menus.menu_name": query }},
                        { match: { "menus.description": query }}
                      ]
                    }
                  }
                }
              }
            ],
            minimum_should_match: 1
          }
        }
      })
    })
    .then(response => response.json())
    .then(data => displaySearchResults(data.hits.hits))  // Assuming response format
    .catch(error => console.error('Error:', error));
  }

  function displaySearchResults(results) {
    var searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = '';
    results.forEach(function(item) {
      var div = document.createElement('div');
      div.className = 'search-result-entry';
  
      var imageUrl = item._source.image_url || 'path/to/default-image.jpg'; // 기본 이미지 경로 추가
      var imageElement = document.createElement('img');
      imageElement.src = imageUrl;
  
      var content = document.createElement('div');
      content.innerHTML = `<strong>${item._source.name}</strong><br/>
                           Category: ${item._source.category}<br/>
                           Address: ${item._source.address}<br/>
                           Rating: ${item._source.rating}<br/>`;
  
      var menuInfo = document.createElement('div');
      menuInfo.className = 'menu-info';
  
      if (item._source.menus) {
        item._source.menus.forEach(function(menu) {
          var menuItem = document.createElement('div');
          menuItem.className = 'menu-item';
          var menuImage = document.createElement('img');
          menuImage.src = menu.image_url || 'path/to/default-menu-image.jpg'; // 메뉴 이미지 URL
          menuItem.appendChild(menuImage);
          menuItem.innerHTML += `<strong>${menu.menu_name}</strong><br/>
                                 <strong>Price:</strong> ${menu.price}<br/>
                                 <strong>Description:</strong> ${menu.description}`;
          menuInfo.appendChild(menuItem);
        });
      }
  
      div.appendChild(imageElement);
      div.appendChild(content);
      div.appendChild(menuInfo);
      searchResultsContainer.appendChild(div);
    });
  }
  
  
});

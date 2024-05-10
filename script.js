document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('searchInput');
  var resultsContainer = document.getElementById('autocompleteResults');

  searchInput.addEventListener('input', function() {
    var query = this.value;
    fetchAutocompleteResults(query);
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
});

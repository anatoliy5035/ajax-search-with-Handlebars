
let Cities = (function () {
    var citiesContent = document.getElementById("cities");
    let alert = document.querySelector(".alert");
    let source = document.getElementById('cityItemTemplate').innerHTML;
    let templateFn = Handlebars.compile(source);
        function pageLoaded() {
            return new Promise(function (resolve) {
                if (document.readyState == 'complete') {
                    resolve();
                } else {
                    window.onload = resolve;
                }
            });
        };

        function returnCities(url) {
            fetch(url)
                .then(function (response) {
                    if (response.status !== 200) {
                        console.log('' + 'Looks like there was a problem. Status Code: ' + response.status);
                        return;
                    } else {
                        return response.json();
                    }
                })
                .then(function (data) {
                    return returnSortedArray(data);
                }).then(
                sortedArray => {
                    addToDom(sortedArray, true);
                    events(sortedArray);
                },
                error => {
                    alert("Rejected: " + error);
                }
            ).catch(alert);
        }

        function returnSortedArray(data) {
            let arr = Object.keys(data).map(function (i) {
                return data[i].name
            });
            let sortedArray = arr.sort();
            return sortedArray;
        }

        function addToDom(array,isFind) {
            if (isFind) {
                alert.className = ('alert alert-danger hidden');
            } else {
                alert.className = ('alert alert-danger');
            }
            document.getElementById('city_list').innerHTML = templateFn({city: array});
        }


        function events(arr) {
            let cityArray = arr;
            let cityNameInput = document.querySelector('.city-name');
            cityNameInput.addEventListener('input', function (e) {
                let strInput = cityNameInput.value.toLowerCase();
                let	resultAfterSearch = arr.filter(
                    city => new RegExp(this.value, 'i').test(city)
                );

                if (this.value) {
                    if (resultAfterSearch.length == 0) {
                        addToDom(resultAfterSearch,false);
                    } else {
                        addToDom(resultAfterSearch, true);
                    }
                }
            })
        }

        let init = (url) => {
            pageLoaded().then(() => {
                returnCities(url);
            })
        }
        return {
            init: init
        };
    }());

Cities.init('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');


// register the grid component
Vue.component('qtime-grid', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
    selectedCategory: Array,
    durationMin: Number,
    durationMax: Number,
    showDeleted: Boolean

  },
  data: function () {
    var sortOrders = {};
    this.columns.forEach(function (key) {
      sortOrders[key] = 1;
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      var durationMin = this.durationMin;
      var durationMax = this.durationMax;
      var selectedCategory = this.selectedCategory;


      this.$nextTick(function () {

        placeFooter();

      });

      if (this.showDeleted) {
          data = data.filter(function (entry) {
            return entry.deleted ;
        });
      } else {
          data = data.filter(function (entry) {
            return !('deleted' in entry) ||  !entry.deleted;
        });
      }

      // filter search key
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }


      // filter duration
      data = data.filter(function(entry){
        if (!entry.duration||isNaN(entry.duration))
          return true;
        var dur = parseInt(entry.duration);
        return dur >= durationMin && ( durationMax === DURATION_MAX || dur <= durationMax );
      });

      // filter category
      if (selectedCategory.length > 0 && selectedCategory.indexOf("") ==-1) {

        data = data.filter(function (entry) {
          // If the entry's category is in the selected categories array, keep the entry
          return selectedCategory.indexOf(entry.category) > -1 ;
        });
      }

      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          // console.log(sortKey);
          if (sortKey == 'duration') {

            if (!$.isNumeric(a))
              return order;
            if (!$.isNumeric(b))
              return -1*order;
            a = parseFloat(a);
            b = parseFloat(b);
          }

          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {

    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    prepareLink: function (val) {
      if (val.indexOf('http')===-1) {
        return 'http://'+val;
      }

      return val;

    },
    getColName: function (key) {

      var dict = {
        "name": "Name",
        "duration": "Time",
        "category": "Category",
        "link": "Link",
        "note": "Note"
      }

      lang = Cookies.get('lang');
      if (lang === 'cn') {
        
        dict = {
                "name": "名称",
                "duration": "时长",
                "category": "类别",
                "link": "链接",
                "note": "描述"
              }
      }
      return dict[key];
    }


  }
})



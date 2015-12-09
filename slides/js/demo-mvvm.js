var vm = avalon.define({
  $id: "plus-minus",
  num: 0,
  plus: function(){
    vm.num = +vm.num + 1
  },
  minus: function(){
    vm.num = +vm.num - 1
  }
})

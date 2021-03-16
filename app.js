
var BudgetController = (function () {

  var Expense = function (id, val, add_description) {
    this.id = id;
    this.val = val;
    this.add_description = add_description;
    this.percentage = -1;
  };
  Expense.prototype.calPerc = function(totalinc){
       
       if(totalinc>0){
         this.percentage =Math.round((this.val/totalinc)*100);
        data.exp_per.push(this.percentage);
      //   return console.log(this.percentage);
       }else{
           this.percentage=-1;
           
     
          }      
        };
    
        Expense.prototype.get_delperc = function(){
         return this.percentage;

     }
       
  var Income = function (id, val, add_description) {
    this.id = id;
    this.val = val;
    this.add_description = add_description;
  };
  var calTotals = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (curr) {
      sum += curr.val;

    })
    data.totals[type] = sum;

  };
  var data = {
    allItems: {
      inc: [],
      exp: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    precentage: -1,
    exp_per:[],
  }
  return {
     calculatePercentages :function(){
        data.allItems.exp.forEach(function(curr){
                   curr.calPerc(data.totals.inc);                        
        });
  },
  getPercentages:function(){
            var allgetPerc = data.allItems.exp.map(function(curr){
                   return curr.get_delperc();
              });
              return allgetPerc;
  },
    DeleteItem: function (type, Id) {
      var ids, index;

      ids = data.allItems[type].map(function (current) {
        return current.id;
        //ids=[2,3,5,6,9] e.g returning array
      });
      index = ids.indexOf(Id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);

      }


    },
    add_Items: function (type, val, desc) {
      var newItems, ID;
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === 'inc') {
        newItems = new Income(ID, val, desc);
      }
      else if (type === 'exp') {
        newItems = new Expense(ID, val, desc);
        
      }
      data.allItems[type].push(newItems);
      return newItems;  //newItems returing id, val, desc
    },


    testing: function () {
      console.log(data);
    },
    calBudget: function () {
      calTotals('inc');
      calTotals('exp');
      data.budget = data.totals.inc - data.totals.exp;
      if (data.budget > 0) {

        data.precentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.precentage = -1;
      }
    },
    getBudget: function () {

      return {
        budget: data.budget,
        percentage: data.precentage,
        totalinc: data.totals.inc,
        totalexp: data.totals.exp,
      }

    },
  }

})();

var UIController = (function () {
  var DomStrings = {
    add_disc: '.add__description',
    val: '.add__value',
    add_typ: '.add__type',
    add_btn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    del: '.del_btn',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensePercentage:'.item__percentage',
    date:'.budget__title--month'

  }
  var nodeList=function(list,callback){
    for(var i=0; i<list.length; i++){
   callback(list[i],i);
   
    }
}


  return {  // UIController is become object which have method getInput that returning a obj 
    formatNumb:function(val,type){
      var splitnum,int,dec;
      val=val.toFixed(2);
      splitnum=val.split('.');    // RETURN ARRAY['43556','00']
       int=splitnum[0];          //INT HAVE STRING E.G '43556'
       dec=splitnum[1];         // STRING NUMB '00'
       console.log(splitnum,int,dec);
        
          
            if(type==='inc'){
              if(int.length>3){
                int= int.substr(0,int.length-3)+','+ int.substr(int.length-3,int.length);
                return '+' + int+'.'+ dec;
              }}  
        
        else if(type==='exp'){
          if(int.length>3){
            int= int.substr(0,int.length-3)+','+ int.substr(int.length-3,int.length);
            return '-' + int+'.'+ dec;
          }
         
        }
        return (type==='inc'? '+':'-') + int+'.'+ dec;
   },
     disp_color:function(type){
      var fields = document.querySelectorAll(DomStrings.add_disc+','+DomStrings.val+','+ DomStrings.add_typ);
      //nodeList(fields,function(curr){
        for(var i=0; i<fields.length; i++){
      
        fields[i].classList.toggle('red-focus');
     
       
      
    }
    //  });
     
   document.querySelector( DomStrings.add_btn).classList.toggle('red');         

    },   
    DisplayDate:function(){
      const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      let current_datetime = new Date()
      let formatted_date = current_datetime.getFullYear() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds(); 
      return formatted_date;
      console.log(formatted_date)
    },
    DisplayPercentage:function(percentage){
      // percentage[10,50,25,44]
     //  field[itm_perc, itm_perc,itm_perc]
 var el,fields,field,counter=0;
 fields=BudgetController.getPercentages();
   field= document.querySelectorAll(DomStrings.expensePercentage);
   console.log(field);
   console.log(percentage);
       
              nodeList(field,function(curr,index){
          if(percentage[index]>0){
            curr.textContent = percentage[index]+'%';
            
               
          }else{
            curr.textContent='---';
          }
        })
        
     

    },
    DeleteItemList: function (select) {

      var el = document.getElementById(select);
      el.parentNode.removeChild(el);
      console.log(el);
    },
    getInput: function () { //getInput get object by returning
      return {
        add_disc: document.querySelector(DomStrings.add_disc).value,
        val: parseFloat(document.querySelector(DomStrings.val).value),
        add_typ: document.querySelector(DomStrings.add_typ).value, //will get inc or exp

      }

    },
    budgetlabels: function (obj) {
      document.querySelector(DomStrings.incomeLabel).textContent = obj.totalinc;

      document.querySelector(DomStrings.expenseLabel).textContent = obj.totalexp;
      document.querySelector(DomStrings.budgetLabel).textContent = obj.budget;
      if (obj.percentage > 0) {
        document.querySelector(DomStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DomStrings.percentageLabel).textContent = '--';
      }
    },

    clearField: function () {
      var field, ArrField;
      field = document.querySelectorAll(DomStrings.add_disc + ', ' + DomStrings.val);
      ArrField = Array.prototype.slice.call(field); // list convert into array
      ArrField.forEach(function (current, index, array) {
        current.value = "";

      })
    },
    addItemsList: function (id, val, desc, type) {
      var html, newHtml, element;
      if (type === 'inc') {
        element = DomStrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

      }
      else if (type === 'exp') {
        element = DomStrings.expenseContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
      
      }
      newHtml = html.replace('%id%', id);
      newHtml = newHtml.replace('%description%', desc);
      newHtml = newHtml.replace('%value%', this.formatNumb(val,type));


      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      var ak = Array.prototype.slice.call(newHtml);

      return ak;
    },

    Dom_Strings: function () {
      return DomStrings;
    },
  }


})();

var Controller = (function () {
  var newItemss, inp;

  var updateBudget = function () {
    BudgetController.calBudget();
    Budget = BudgetController.getBudget();
    UIController.budgetlabels(Budget);
    console.log(Budget)

  };
var updatePerc=function(){
  BudgetController.calculatePercentages();
 var percentage= BudgetController.getPercentages();
 UIController.DisplayPercentage(percentage);
  

}
  var CtrlAddItems = function () {
    inp = UIController.getInput();
    UIController.clearField();
    UIController.disp_color(inp.add_typ);
    //var percentage=UIController.DisplayPercentage();
    //BudgetController.getBudget(inp.add_typ);
    //console.log(percentage);
    
    if (inp.add_disc !== "" && !isNaN(inp.val) && inp.val > 0) {
      
      newItemss = BudgetController.add_Items(inp.add_typ, inp.val, inp.add_disc)
      UIController.formatNumb(inp.val,inp.add_typ);
      UIController.addItemsList(newItemss.id, newItemss.val, newItemss.add_description, inp.add_typ);
      
      BudgetController.testing();
  

    }
    updateBudget();
    updatePerc();
  }


  var setupEvent = function () {
    var Dom = UIController.Dom_Strings();
    
    document.querySelector(Dom.add_typ).addEventListener('click',UIController.disp_color);
    document.querySelector(Dom.add_btn).addEventListener('click', CtrlAddItems)
   
    
    // document.querySelector(Dom.del).addEventListener('click', function(){
    //   var tk=[];
    //    tk.push(UIController.addItemsList());
    //           tk.forEach(function(curr){
    //                document.write(tk);
    //           })
    // })

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        // console.log('Key was pressed');
        CtrlAddItems();

      }


    });
    document.querySelector(Dom.container).addEventListener('click', CtrlDeleteItems)
  }
  var CtrlDeleteItems = function (event) {
    var ItemId, SplidId, type, id;
    ItemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    //console.log(ItemId);
    if (ItemId) {
      SplidId = ItemId.split('-');
      id = parseInt(SplidId[1]);
      type = SplidId[0];
      BudgetController.DeleteItem(type, id);
      UIController.DeleteItemList(ItemId);
      updateBudget();
    }
  }

  return {
    init: function () {
     
     
      var month=UIController.DisplayDate();
      document.querySelector('.budget__title--month').textContent=month;
      UIController.budgetlabels({
        budget: 0,
        percentage: -1,
        totalinc: 0,
        totalexp: 0,
      });
      setupEvent();
    }
  };
})();

Controller.init();
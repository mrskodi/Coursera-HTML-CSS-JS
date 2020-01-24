function makeMultiplier(multiplier){
  // var multiplier = 3
  return(
    function (x){
      return multiplier * x;
    }
  );
}

var tripleAll = makeMultiplier(3); // 
console.log(tripleAll(10));
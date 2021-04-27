const Common = {
  deleteDuplicatesInArray(arr) {
    let arr_dupli = arr.slice(0);
    let nuArr = [];

    arr_dupli.forEach(element => {
      if(!nuArr.includes(element)){
        nuArr.push(element);
      }
    });
   
    return nuArr;
  }
  
}

export default Common;
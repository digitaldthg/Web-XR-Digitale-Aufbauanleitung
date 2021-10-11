const Common = { /**
   * @method deleteDuplicatesInArray
   * @argument {Array} arr Array mit potentiellen Duplikaten
   * @returns Array ohne Duplikate 
   */
  deleteDuplicatesInArray(arr) {
    let arr_dupli = arr.slice(0);
    let nuArr = [];

    arr_dupli.forEach(element => {
      if (! nuArr.includes(element)) {
        nuArr.push(element);
      }
    });

    return nuArr;
  }
}

export default Common;

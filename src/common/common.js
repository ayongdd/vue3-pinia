function setDate(key,data){
  if(data==0){data="0"}
  data=data || "";
  sessionStorage[key]=JSON.stringify(data);
}

function setDate2(key,data){
  if(data==0){data="0"}
  data=data || "";
  sessionStorage[key]=JSON.stringify(data);
}


function getDate(key) {
  let data=sessionStorage[key] || false;
  try {
    data=JSON.parse(data);
  }catch (e){
    data="";
  }
  return data;
}
function getCodeState(code) {
  if(code === 0 || code == 8888){
    return true;
  }else {
    return false
  }
}

function setSession(key,data){
  data=data || ""
  sessionStorage[key]=JSON.stringify(data);
}

function getSession(key) {
  let data=sessionStorage[key] || false;
  data=JSON.parse(data);
  return data;
}

function cleraSeeion(key){
  // Cookies.remove(key);
  sessionStorage.removeItem(key);
  localStorage.removeItem(key);
}


function setLocal(key,data){
  data=data || ""
  localStorage[key]=JSON.stringify(data);
}

function getLocal(key) {
  let data=localStorage[key] || false;
  data=JSON.parse(data);
  return data;
}

function clearLocal(key){
  // Cookies.remove(key);
  localStorage.removeItem(key);
}

function getTimes (t) {
  let date = new Date(t * 1000)
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return Y + M + d + ' ' + h + ':' + m + ':' + s;
}

function deepCopy(data, hash = new WeakMap()) {
  if(typeof data !== 'object' || data === null){
    throw new TypeError('传入参数不是对象')
  }
  // 判断传入的待拷贝对象的引用是否存在于hash中
  if(hash.has(data)) {
    return hash.get(data)
  }
  let newData = {};
  const dataKeys = Object.keys(data);
  dataKeys.forEach(value => {
    const currentDataValue = data[value];
    // 基本数据类型的值和函数直接赋值拷贝
    if (typeof currentDataValue !== "object" || currentDataValue === null) {
      newData[value] = currentDataValue;
    } else if (Array.isArray(currentDataValue)) {
      // 实现数组的深拷贝
      newData[value] = [...currentDataValue];
    } else if (currentDataValue instanceof Set) {
      // 实现set数据的深拷贝
      newData[value] = new Set([...currentDataValue]);
    } else if (currentDataValue instanceof Map) {
      // 实现map数据的深拷贝
      newData[value] = new Map([...currentDataValue]);
    } else {
      // 将这个待拷贝对象的引用存于hash中
      hash.set(data,data)
      // 普通对象则递归赋值
      newData[value] = deepCopy(currentDataValue, hash);
    }
  });
  return newData;
}
export {
  getCodeState,
  setDate,
  setDate2,
  getDate,
  setSession,
  getSession,
  getTimes,
  cleraSeeion,
  setLocal,
  getLocal,
  clearLocal,
  deepCopy,
}



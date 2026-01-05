const colors = [
  'cyan',
  'yellow', 
  'purple',  
  'green', 
  'red',    
  'blue',  
  'orange'   
];


let index=0;

export function getNextColor()
{
    const color=colors[index];
    index=(index+1)%(colors.length);
    return color;
}
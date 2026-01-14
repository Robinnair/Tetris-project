const colors = [
  '#7FE7F7',  
  '#FFF59D',  
  '#D7B5F8',  
  '#9BE7A6',  
  '#F8A1A1',  
  '#9FC5F8',  
  '#FFCC99'   
];


let index=0;

export function getNextColor()
{
    const next=Math.random();
    if(next<1/6)
    {
      return colors[0];
    }
    if(next>=(1/6)&&next<(2/6))
    {
      return colors[1];
    }
    if((next>=(2/6)&&next<(3/6)))
    {
      return colors[2];
    }
    if((next>=(3/6)&&next<(4/6)))
    {
      return colors[3];
    }
    if((next>=(4/6)&&next<(5/6)))
    {
      return colors[4];
    }
    if((next>=(5/6)&&next<(6/6)))
    {
      return colors[5];
    }
    if((next>=(6/6)))
    {
      return colors[6];
    }
}
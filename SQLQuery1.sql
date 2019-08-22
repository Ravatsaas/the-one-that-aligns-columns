-- traisling comma
select *
from (
values
    (1, 2, 'x,y'),
    (2, 15.3, 'test'),
    (200, 'this is avery, very, very wide string', 'hi')
)
as x(a,b,c)

--leading comma
select *
from (
values
      (1, 2, 'x,y')
    ,(2, 15.3, 'test')
    ,(200, 'this is avery, very, very wide string', 'hi')
)
as x(a,b,c)
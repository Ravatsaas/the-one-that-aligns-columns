# The One That Aligns Columns

It's easy. Just put your cursor over a list of values and use one of the magical key combinations.

`alt+,` makes this happen:
```
values
    (  1,    2, 'x,y' ),
    (  2, 15.3, 'test'),
    (200,    2, 'hi'  )
)
```

`alt+shift+,` makes this happen:
```
values
    (1, 2, 'x,y'),
    (2, 15.3, 'test'),
    (200, 2, 'hi')
)
```

Bonus: It also aligns equal signs:

`alt+=` makes turns this:
```
select
    FullName = FirstName + ' ' + LastName,
    Age = datepart(year, current_timestamp) - YearOfBirth
from MyTable
```
into this:
```
select
    FullName = FirstName + ' ' + LastName,
    Age      = datepart(year, current_timestamp) - YearOfBirth
from MyTable
```

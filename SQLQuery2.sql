select
Test = max(Price),
  AnotherTestField = (min(Price)
          + max(Price)) / 2
,ComplexTest= 100 * sum(iif(D >= 10, S, 0))
                                                             / nullif(sum (MarketValue), 0)
from Products
where ProductID = 37
or ProductName           = 'Thirty Seven'
and (Name like '%*FFF%')

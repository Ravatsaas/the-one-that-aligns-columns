select
Test = max(Price),
AnotherTestField = (min(Price)
          + max(Price)) / 2
from Products
where ProductID = 37
or ProductName           = 'Thirty Seven'

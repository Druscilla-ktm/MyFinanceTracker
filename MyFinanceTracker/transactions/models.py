from django.db import models

# Create your models here.
class Transactions(models.Model):
    INCOME = 'Income'
    EXPENSE = 'Expense'

    TRANSASCTION_TYPES = [
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense')
    ]
    User= models.CharField(max_length=30)
    Transactiontype = models.CharField(max_length=7, choices=TRANSASCTION_TYPES)
    Amount = models.DecimalField(max_digits=10, decimal_places=2)
    Date = models.DateField()
    CATEGORY_CHOICES = [
        #Categories for Income
        ('Salary', 'Salary'),
        ('Gift', 'Gift'), #money from friends or family for upkeep
        ('Earnings', 'Earnings'), #money from investments, etc.

        #Categories for Expense

        #the 50% Daily needs
        ('Food', 'Food'), #anything to do with eating out or groceries
        ('Rent', 'Rent'),
        ('Personal', 'Personal'), #utilities, transport, cosmetics, etc.
        
        #the 30% spending/ wants
        ('Investment', 'Investment'),

        #the 20% savings
        ('Savings', 'Savings'),
    ]
    Categorychoice = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    Description = models.CharField(max_length=40, blank=True)

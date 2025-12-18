from django.shortcuts import render
from .models import Transactions

# Create your views here.
def transaction_list(request):
    transactions = Transactions.objects.all()
    return render(request, 'transactions/transaction_list.html', {'transactions': transactions})
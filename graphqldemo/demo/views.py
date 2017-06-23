# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from demo.schema import Query
import graphene
import json

def query(request):
    schema = graphene.Schema(query=Query)

    result = schema.execute('''
      {
        user(id: 3) {
            name
        }
      }
    ''')
    return HttpResponse(json.dumps(result.data))

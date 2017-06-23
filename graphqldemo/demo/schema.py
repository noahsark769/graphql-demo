import graphene
from demo import models

class User(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()

    def resolve_id(self, args, context, info):
        return self.id

    def resolve_name(self, args, context, info):
        return self.name

class Query(graphene.ObjectType):
    user = graphene.Field(
        User,
        id=graphene.Argument(
            graphene.Int,
            required=True,
        )
    )

    user = graphene.Field(
        User,
        id=graphene.Argument(
            graphene.Int,
            required=True,
        )
    )

    def resolve_user(self, args, context, info):
        user = models.User.objects.get(id=args['id'])
        return User(id=user.id, name=user.name)
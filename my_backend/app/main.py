from app.routes.watchlist_routes import router as watchlist_router
from app.routes.notification_routes import router as notification_router
from app.routes.activity_routes import router as activity_router
from app.routes.review_routes import router as review_router
from app.routes.message_routes import router as message_router
from app.routes.friend_routes import router as friend_router
from app.routes.trace_moe_routes import router as trace_moe_router
from app.routes.image_search_routes import router as image_search_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.user_routes import router as user_router
from app.routes.anime_routes import router as anime_router
from app.routes.matchmaking_routes import router as matchmaking_router
from app.routes.admin_routes import router as admin_router
from app.services.database import init_db


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(image_search_router, prefix="/image", tags=["image-search"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(anime_router, prefix="/anime", tags=["anime"])
app.include_router(matchmaking_router, prefix="/matchmaking", tags=["matchmaking"])
app.include_router(admin_router, prefix="/admin", tags=["admin"])
app.include_router(trace_moe_router, prefix="/trace", tags=["trace-moe"])
app.include_router(friend_router, prefix="/friends", tags=["friend-system"])
app.include_router(message_router, prefix="/messages", tags=["messaging"])
app.include_router(review_router, prefix="/reviews", tags=["reviews"])
app.include_router(activity_router, prefix="/activity", tags=["activity-feed"])
app.include_router(notification_router, prefix="/notifications", tags=["notifications"])
app.include_router(watchlist_router, prefix="/watchlist", tags=["watchlist"])

@app.get('/')
def root():
    return {'message': 'AniFind backend is running!'}

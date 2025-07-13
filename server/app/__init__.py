from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.config import Config
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(
        app,
        resources={r"/*": {"origins": ["http://localhost:5173", "https://rewear-odoo-lovat.vercel.app"]}},
        supports_credentials=True
    )

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    from app.routes.items import items_bp
    app.register_blueprint(items_bp, url_prefix='/items')

    from app.routes.users import users_bp
    app.register_blueprint(users_bp, url_prefix='/users')

    from app.routes.swaps import swaps_bp
    app.register_blueprint(swaps_bp, url_prefix='/swaps')


    return app
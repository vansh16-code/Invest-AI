"""Rename name column to username

Revision ID: e96fa8083290
Revises: 
Create Date: 2025-10-14 18:26:01.423503

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e96fa8083290'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Check if 'name' column exists before renaming
    connection = op.get_bind()
    result = connection.execute(sa.text("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'name'
    """))
    
    if result.fetchone():
        # Rename 'name' column to 'username'
        op.alter_column('users', 'name', new_column_name='username')
    else:
        # If 'name' doesn't exist, check if 'username' already exists
        result = connection.execute(sa.text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'username'
        """))
        
        if not result.fetchone():
            # Neither exists, add username column
            op.add_column('users', sa.Column('username', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Rename 'username' back to 'name'
    op.alter_column('users', 'username', new_column_name='name')

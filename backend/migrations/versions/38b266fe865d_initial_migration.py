"""initial migration"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '38b266fe865d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():

    # BOOKINGS TABLE
    with op.batch_alter_table('bookings') as batch_op:
        batch_op.drop_constraint('bookings_flat_id_fkey', type_='foreignkey')
        batch_op.drop_constraint('bookings_user_id_fkey', type_='foreignkey')

        batch_op.create_foreign_key(
            'fk_bookings_user_id',
            'users',
            ['user_id'],
            ['id'],
            ondelete='CASCADE'
        )

        batch_op.create_foreign_key(
            'fk_bookings_flat_id',
            'flats',
            ['flat_id'],
            ['id'],
            ondelete='CASCADE'
        )


    # FLATS TABLE
    with op.batch_alter_table('flats') as batch_op:

        batch_op.add_column(
            sa.Column(
                'flat_number',
                sa.String(50),
                nullable=False,
                server_default='UNKNOWN'
            )
        )

        batch_op.add_column(
            sa.Column(
                'flat_type',
                sa.String(50),
                nullable=False,
                server_default='1BHK'
            )
        )

        batch_op.drop_column('status')
        batch_op.drop_column('title')


    # USERS TABLE
    with op.batch_alter_table('users') as batch_op:

        batch_op.alter_column(
            'email',
            type_=sa.String(120),
            existing_type=sa.VARCHAR(100),
            nullable=False
        )

        batch_op.alter_column(
            'role',
            nullable=True,
            existing_type=sa.VARCHAR(20),
            existing_server_default=sa.text("'user'::character varying")
        )

        batch_op.drop_column('created_at')


def downgrade():

    with op.batch_alter_table('users') as batch_op:

        batch_op.add_column(
            sa.Column(
                'created_at',
                postgresql.TIMESTAMP(),
                server_default=sa.text('CURRENT_TIMESTAMP')
            )
        )

        batch_op.alter_column(
            'role',
            nullable=False,
            existing_type=sa.VARCHAR(20),
            existing_server_default=sa.text("'user'::character varying")
        )

        batch_op.alter_column(
            'email',
            type_=sa.VARCHAR(100),
            existing_type=sa.String(120)
        )
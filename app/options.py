from decimal import Decimal

import dbsettings


class InternalOptions(dbsettings.Group):
    nft_last_block = dbsettings.IntegerValue()

    tokenomics_last_update = dbsettings.DateTimeValue()
    tokenomics_burnt = dbsettings.DecimalValue(default=Decimal(0))
    tokenomics_burnt_delta = dbsettings.DecimalValue(default=Decimal(0))

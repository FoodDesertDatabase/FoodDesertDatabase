# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = True` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

# AbstractUser Authorization model: Uses email as unique login
#class CustomUser(AbstractUser):
#    email = models.EmailField(blank=False),
#    unique=True

class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Contacts(models.Model):
    c_id = models.IntegerField(primary_key=True)
    first = models.CharField(max_length=50, blank=True, null=True)
    last = models.CharField(max_length=50, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    c_supplier = models.ForeignKey('Supplier', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'contacts'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class HhAllergies(models.Model):
    hh_a_id = models.SmallAutoField(primary_key=True)
    a_type = models.CharField(max_length=30, blank=True, null=True)
    a_code = models.IntegerField(blank=True, null=True)
    a_hh_id = models.ForeignKey('Households', models.CASCADE, related_name='hh_allergies', db_column='a_hh_id')

    class Meta:
        managed = True
        db_table = 'hh_allergies'


class HhKits(models.Model):
    hk_id = models.SmallIntegerField(primary_key=True)
    hk_kit = models.ForeignKey('Kits', models.CASCADE, blank=True, null=True)
    hk_hh_id = models.ForeignKey('Households', models.CASCADE, db_column='hk_hh_id', related_name='hh_kit', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'hh_kits'


class HhMealPlans(models.Model):
    hh_m_id = models.SmallAutoField(primary_key=True)
    meal = models.ForeignKey('MealPlans', models.CASCADE)
    meal_hh_id = models.ForeignKey('Households', models.CASCADE, null=False, related_name='hh_meal', db_column='meal_hh_id')
    hh_s_c = models.OneToOneField('ServingCalculations', models.CASCADE, db_column='hh_s_c_id')

    class Meta:
        managed = True
        db_table = 'hh_meal_plans'


class Households(models.Model):
    hh_id = models.AutoField(primary_key=True)
    hh_first_name = models.CharField(null=False, max_length=30)
    hh_last_name = models.CharField(null=False, max_length=30)
    num_adult = models.PositiveIntegerField(blank=True, null=True)
    num_child_lt_6 = models.PositiveIntegerField(blank=True, null=True)
    num_child_gt_6 = models.PositiveIntegerField(blank=True, null=True)
    sms_flag = models.PositiveIntegerField(blank=True, null=True)
    veg_flag = models.PositiveIntegerField(blank=True, null=True)
    allergy_flag = models.PositiveIntegerField(blank=True, null=True)
    gf_flag = models.PositiveIntegerField(blank=True, null=True)
    ls_flag = models.PositiveIntegerField(blank=True, null=True)
    paused_flag = models.PositiveIntegerField(blank=True, null=True)
    paying = models.PositiveIntegerField(blank=True, null=True)
    phone = models.CharField(max_length=12, blank=True, null=True)
    street = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    pcode = models.PositiveIntegerField(blank=True, null=True)
    state = models.CharField(max_length=2, blank=True, null=True)
    ebt = models.CharField(max_length=16, blank=True, null=True)
    ebt_refill_date = models.PositiveIntegerField(blank=True, null=True, validators=[MinValueValidator(1), MaxValueValidator(31)])
    delivery_notes = models.TextField(blank=True, null=True)
    hh_bags_or_crates = models.CharField(max_length=30, blank=True, null=True)
    ppMealKit_flag = models.BooleanField(default=False)
    childrenSnacks_flag = models.BooleanField(default=False)
    foodBox_flag = models.BooleanField(default=False)
    rteMeal_flag = models.BooleanField(default=False)
    restriction_flag = models.PositiveIntegerField(blank=True, null=True, default=0)
  
    class Meta:
        managed = True
        db_table = 'households'

class ProductSubscriptionHistory(models.Model):
    household = models.ForeignKey(Households, on_delete=models.CASCADE, related_name='subscription_history')
    product_type = models.CharField(max_length=30)
    subscribed = models.BooleanField()
    timestamp = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'product_subscription_history'

class DietaryRestrictions(models.Model):
    id = models.AutoField(primary_key=True)
    household = models.ForeignKey(Households, on_delete=models.CASCADE, related_name='dietary_restrictions')
    restriction_type = models.CharField(max_length=50)
    servings = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        managed = True
        db_table = 'dietary_restrictions'

from storages.backends.azure_storage import AzureStorage

class OverwriteAzureStorage(AzureStorage):
    def get_available_name(self, name, max_length=None):
        self.delete(name)
        return name

class ImageUpload(models.Model):
    file = models.FileField(storage=OverwriteAzureStorage)
    date_uploaded = models.DateTimeField(auto_now_add=True)

class IngredientUnits(models.Model):
    i_unit_id = models.AutoField(primary_key=True, db_column='i_unit_id')
    i_name = models.ForeignKey("IngredientNames", models.CASCADE, db_column='i_name_id', related_name="ing_units")
    recipe_amt = models.DecimalField(null=False, max_digits=8, decimal_places=2)
    recipe_unit = models.CharField(null=False, max_length=45)
    shop_amt = models.DecimalField(null=False, max_digits=8, decimal_places=2)
    shop_unit = models.CharField(null=False, max_length=45)
    
    class Meta:
        managed = True
        db_table = 'ingredient_units'

class IngredientNames(models.Model):
    ing_name_id = models.AutoField(primary_key=True)
    ing_name = models.CharField(null=False, max_length=100)

    class Meta: 
        managed = True
        db_table = 'ingredient_names'

class IngredientUsages(models.Model):
    i_usage_id = models.SmallIntegerField(primary_key=True)
    used_date = models.CharField(max_length=45)
    used_qty = models.CharField(max_length=45)
    used_ing = models.ForeignKey('Ingredients', models.CASCADE, related_name='ingredient_usage')

    class Meta:
        managed = True
        db_table = 'ingredient_usages'

class Ingredients(models.Model):
    i_id = models.AutoField(primary_key=True)
    ingredient_name = models.CharField(max_length=50)
    pkg_type = models.CharField(max_length=50)
    storage_type = models.CharField(max_length=50)
    in_date = models.DateField(blank=True, null=True)
    in_qty = models.PositiveSmallIntegerField(blank=True, null=True)
    unit = models.CharField(max_length=10, blank=True, null=True)
    exp_date = models.DateField(blank=True, null=True)
    qty_on_hand = models.SmallIntegerField(blank=True, null=True)
    unit_cost = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    flat_fee = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    isupplier = models.ForeignKey('Supplier', models.CASCADE, related_name='isupplier', blank=True, null=True)
    pref_isupplier = models.ForeignKey('Supplier', models.CASCADE, related_name='pref_isupplier', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ingredients'

# class IPLMealPlans(models.Model):
#     m_id = models.AutoField(primary_key=True)
#     m_date = models.DateField()
#     snack_r_num = models.ForeignKey('Recipes', models.CASCADE, db_column='snack_r_num', related_name='snack_r_num', blank=True, null=True)
#     snack_servings = models.SmallIntegerField(blank=True, null=True)
#     meal_r_num = models.ForeignKey('Recipes', models.CASCADE, db_column='meal_r_num', related_name='meal_r_num', blank=True, null=True)
#     meal_servings = models.SmallIntegerField(blank=True, null=True)
#     recipe_ing = models.ForeignKey('RecipeIngredients', models.CASCADE, db_column='ri_recipe_num', related_name='recipe_ing', blank=True, null=True)

#     class Meta:
#         managed = True
#         db_table = 'meal_plans'

class KitPackaging(models.Model):
    kp_id = models.IntegerField(primary_key=True)
    kp_p_id = models.CharField(max_length=50)
    qty = models.SmallIntegerField()
    kp_kit = models.ForeignKey('Kits', models.CASCADE)

    class Meta:
        managed = True
        db_table = 'kit_packaging'


class Kits(models.Model):
    k_id = models.AutoField(primary_key=True)
    k_date = models.DateField()
    k_hh_id = models.ForeignKey(Households, models.CASCADE, db_column='k_hh_id')
    k_s_c = models.OneToOneField('ServingCalculations', models.CASCADE, db_column='k_s_c_id')

    class Meta:
        managed = True
        db_table = 'kits'

class MealPacks(models.Model):
    mp_id = models.AutoField(primary_key=True)
    mp_date = models.DateField()
    mp_hh_id = models.ForeignKey(Households, models.CASCADE, db_column='mp_hh_id')
    mp_stn_name = models.ForeignKey('Stations', models.CASCADE, db_column='mp_stn_name')
    mp_kit = models.ForeignKey(Kits, models.CASCADE)

    class Meta:
        managed = True
        db_table = 'meal_packs'

class MealPlans(models.Model):
    m_id = models.AutoField(primary_key=True)
    m_date = models.DateField()
    snack_r_num = models.ForeignKey('Recipes', models.CASCADE, db_column='snack_r_num', related_name='snack', blank=True, null=True)
    snack_servings = models.SmallIntegerField(blank=True, null=True)
    meal_r_num = models.ForeignKey('Recipes', models.CASCADE, db_column='meal_r_num', related_name='meal', blank=True, null=True)
    meal_servings = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'meal_plans'
        
class PackagingTypeSizes(models.Model):
    pkg_size_id = models.AutoField(primary_key=True)
    pkg_size = models.CharField(max_length=50)
    pkg_holds = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    pkg_type_fk = models.ForeignKey('PackagingTypes', models.CASCADE, db_column='pkg_type_fk', related_name='pkg_sizes')
        
class PackagingTypes(models.Model):
    pkg_type_id = models.AutoField(primary_key=True)
    pkg_type = models.CharField(unique=True, max_length=50)

class Packaging(models.Model):
    p_id = models.AutoField(primary_key=True)
    package_type = models.CharField(max_length=50)
    unit_qty = models.SmallIntegerField(blank=True, null=True)
    unit_cost = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    qty_holds = models.SmallIntegerField(blank=True, null=True)
    unit = models.CharField(max_length=10, blank=True, null=True)
    returnable = models.IntegerField(blank=True, null=True)
    in_date = models.DateField(blank=True, null=True)
    in_qty = models.SmallIntegerField(blank=True, null=True)
    exp_date = models.DateField(blank=True, null=True)
    qty_on_hand = models.SmallIntegerField(blank=True, null=True)
    flat_fee = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    psupplier = models.ForeignKey('Supplier', models.CASCADE, related_name = 'psupplier', blank=True, null=True)
    pref_psupplier = models.ForeignKey('Supplier', models.CASCADE, related_name = 'pref_psupplier', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'packaging'


class PackagingUsages(models.Model):
    p_usage_id = models.SmallIntegerField(primary_key=True)
    used_date = models.DateField()
    used_qty = models.SmallIntegerField()
    used_pkg = models.ForeignKey(Packaging, models.CASCADE, related_name='packaging_usage')
    used_s_c = models.ForeignKey('ServingCalculations', models.CASCADE, db_column="used_s_c_id")

    class Meta:
        managed = True
        db_table = 'packaging_usages'


class RecipeAllergies(models.Model):
    ra_id = models.SmallIntegerField(primary_key=True)
    allergy = models.CharField(max_length=30)
    ra_recipe_num = models.ForeignKey('Recipes', models.CASCADE, related_name='r_allergies', db_column='ra_recipe_num')

    class Meta:
        managed = True
        db_table = 'recipe_allergies'


class RecipeDiets(models.Model):
    rd_id = models.SmallIntegerField(primary_key=True)
    diet_category = models.CharField(max_length=50)
    rd_recipe_num = models.ForeignKey('Recipes', models.CASCADE, related_name='r_diets', db_column='rd_recipe_num')

    class Meta:
        managed = True
        db_table = 'recipe_diets'


class RecipeIngredients(models.Model):
    ri_id = models.SmallIntegerField(primary_key=True)
    ingredient_name = models.CharField(max_length=100)
    amt = models.DecimalField(max_digits=6, decimal_places=3)
    unit = models.CharField(max_length=10)
    prep = models.CharField(max_length=100)
    # ri_ing = models.ForeignKey('Ingredients', models.CASCADE, related_name='ing_name')
    ri_recipe_num = models.ForeignKey('Recipes', models.CASCADE, related_name='r_ingredients', db_column='ri_recipe_num')

    class Meta:
        managed = True
        db_table = 'recipe_ingredients'


class RecipeInstructions(models.Model):
    inst_id = models.IntegerField(primary_key=True)
    step_no = models.IntegerField(blank=True, null=True)
    step_inst = models.TextField(blank=True, null=True)
    stn_name = models.CharField(max_length=50, blank=True, null=True)
    inst_recipe_num = models.ForeignKey('Recipes', models.CASCADE, related_name='r_instructions', db_column='inst_recipe_num', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'recipe_instructions'


class RecipePackaging(models.Model):
    rp_id = models.IntegerField(primary_key=True)
    amt = models.SmallIntegerField(blank=True, null=True)
    pkg_type = models.CharField(max_length=45)
    pkg_contents = models.CharField(max_length=255)
    ing_name = models.CharField(max_length=45, blank=True, null=True)
    rp_pkg = models.ForeignKey(Packaging, models.CASCADE, blank=True, null=True)
    rp_recipe_num = models.ForeignKey('Recipes', models.CASCADE, related_name='r_packaging', db_column='rp_recipe_num', blank=True, null=True)
    rp_ing_id = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'recipe_packaging'


class Recipes(models.Model):
    r_num = models.SmallIntegerField(primary_key=True)
    r_name = models.CharField(max_length=50, blank=True, null=True)
    r_servings = models.SmallIntegerField(default='1')
    r_img_path = models.CharField(max_length=200, blank=True, null=True)
    r_img_upload = models.ForeignKey('ImageUpload', models.SET_NULL, related_name='r_image', db_column='r_img_upload', blank=True, null=True)
    r_card_path = models.CharField(max_length=200, blank=True, null=True)
    r_card_upload = models.ForeignKey('ImageUpload', models.SET_NULL, related_name='r_card', db_column='r_card_upload', blank=True, null=True)
    m_s = models.SmallIntegerField()


    class Meta:
        managed = True
        db_table = 'recipes'


class ServingCalculations(models.Model):
    calc_meal_plan = models.OneToOneField(MealPlans, models.CASCADE, db_column='calc_meal_plan_id', primary_key=True)
    calc_date = models.DateField()

    class Meta:
        managed = True
        db_table = 'serving_calculations'


class StationIngredients(models.Model):
    si_id = models.AutoField(primary_key=True)
    # si_ing_name = models.(max_length=50, null=False)
    si_recipe_ing = models.CharField(max_length=50, db_column='si_recipe_ing', null=False)
    si_station_num = models.ForeignKey('Stations', models.CASCADE, related_name='stn_ings', db_column='si_station_num')

    class Meta:
        managed = True
        db_table = 'station_ingredients'


class StationPackaging(models.Model):
    sp_id = models.SmallIntegerField(primary_key=True)
    sp_pkg = models.ForeignKey(Packaging, models.CASCADE, blank=True, null=True)
    # sp_station_name = models.ForeignKey('Stations', models.CASCADE, db_column='sp_station_name', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'station_packaging'


class Stations(models.Model):
    stn_num = models.IntegerField(primary_key=True)
    stn_name = models.CharField(max_length=50, blank=True, null=False)
    stn_desc = models.TextField(blank=True, null=False)
    stn_recipe_num = models.ForeignKey(Recipes, models.CASCADE, blank=False, null=False, related_name='r_stations', db_column='stn_recipe_num')
    # num_servings = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'stations'


class Supplier(models.Model):
    s_id = models.SmallIntegerField(primary_key=True)
    s_name = models.CharField(max_length=50)
    street = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    pcode = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'supplier'


class Users(models.Model):
    u_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=260)
    admin_flag = models.PositiveIntegerField()
    email = models.CharField(max_length=45)

    class Meta:
        managed = True
        db_table = 'users'

